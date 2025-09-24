import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const masterPrompt = `
Act as an expert code reviewer. Analyze the following git diff.
Provide your response as a single, minified JSON object with NO MARKDOWN formatting.
The JSON object must have three keys: "summary" (a concise string), "edgeCases" (an array of two strings), and "unitTests" (an object with "filePath" and "code" strings).
Do not add any text before or after the JSON object.

Here is the diff:
{raw_git_diff_string}
`;

async function callVertexAI(diff: string, projectId: string) {
  try {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      throw new Error("CRITICAL: GOOGLE_APPLICATION_CREDENTIALS_JSON is not set.");
    }
    
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

    const auth = new GoogleAuth({
      credentials,
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });

    const authToken = await auth.getAccessToken();

    const modelId = 'gemini-1.0-pro'; // Using the stable model
    const apiEndpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/${modelId}:generateContent`;
    
    const finalPrompt = masterPrompt.replace('{raw_git_diff_string}', diff);
    const requestBody = {
      contents: [{ parts: [{ text: finalPrompt }] }],
    };

    const apiResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        throw new Error(`API call failed with status ${apiResponse.status}: ${errorBody}`);
    }

    const responseData = await apiResponse.json();
    const responseText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!responseText) {
      return { 
        summary: "AI analysis did not return a response.",
        edgeCases: ["The AI returned no content, possibly due to safety filters."],
        unitTests: { code: "// No tests generated." }
      };
    }
    
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No valid JSON object found in AI response.");
    }
    const jsonSubstring = responseText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonSubstring);

  } catch (error) {
    console.error("!!! VERTEX AI CALL FAILED !!!", error);
    return { error: `Failed to get analysis from Vertex AI: ${error}` };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const diff = body.diff;
    const projectId = process.env.GCLOUD_PROJECT;

    if (!projectId) {
      return NextResponse.json({ error: "GCLOUD_PROJECT environment variable not set." }, { status: 500 });
    }
    if (!diff) {
      return NextResponse.json({ error: 'Diff is required.' }, { status: 400 });
    }
    
    const analysis = await callVertexAI(diff, projectId);
    
    if (analysis.error) {
       return NextResponse.json(analysis, { status: 500 });
    }
  
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
