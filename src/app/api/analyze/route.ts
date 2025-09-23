import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

// 1. Refined Prompt from the document
const masterPrompt = `Analyze the following git diff and provide a one-sentence summary. Return your response as a single, minified JSON object with one key: "summary". Do not include any other text. Diff: {raw_git_diff_string}`;

async function callVertexAI(diff: string, projectId: string) {
  try {
    const credentialsJSON = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!credentialsJSON) {
      throw new Error("CRITICAL: GOOGLE_APPLICATION_CREDENTIALS_JSON is not set.");
    }
    const credentials = JSON.parse(credentialsJSON);
    const auth = new GoogleAuth({
      credentials,
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    const authToken = await auth.getAccessToken();

    const model = 'gemini-1.5-flash-latest';
    const apiEndpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/${model}:generateContent`;
    
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
    // 3. Log Raw AI Output
    console.log("Gemini raw responseData:", JSON.stringify(responseData, null, 2));

    // 5. Handle Model-Side Filtering
    if (responseData?.candidates?.length === 0) {
      console.error("!!! AI returned no candidates, likely due to safety filters. !!!");
      return { 
        summary: "AI analysis did not return a response. This may be due to safety filters on the input content. Please review the code manually.",
        edgeCases: [],
        unitTests: { code: "// No tests generated." }
      };
    }
    
    const responseText = responseData.candidates[0].content.parts[0].text || '';

    // 4. Robust JSON Parsing
    const jsonMatch = responseText.match(/\{(?:[^{}]|\{[^{}]*\})*\}/);
    if (!jsonMatch) {
      console.error("!!! No valid JSON object found in AI response. !!!", responseText);
      return { error: "Failed to parse AI output as JSON.", rawAIResponse: responseText };
    }
    
    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("!!! VERTEX AI CALL FAILED (Hardened) !!!", error);
    return { error: `Failed to get analysis from Vertex AI: ${error}` };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let diff = body.diff;
    const projectId = process.env.GCLOUD_PROJECT;

    if (!projectId) {
      return NextResponse.json({ error: "GCLOUD_PROJECT environment variable not set." }, { status: 500 });
    }
    
    // 2. Check and Limit Diff Content
    if (!diff || diff.length < 10) {
      return NextResponse.json({ summary: "No substantive code changes detected to analyze.", edgeCases: [], unitTests: {} });
    }
    if (diff.length > 3400) {
      console.log("Diff is too long, truncating...");
      diff = diff.substring(0, 3400);
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
