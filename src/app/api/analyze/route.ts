import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const masterPrompt = `You are Solon, a world-class Staff Software Engineer and an expert in Quality Assurance and TypeScript. Your task is to perform a critical and insightful code review on a pull request. You are rigorous, practical, and focus on what truly matters for software quality. Your sole output MUST be a single, minified JSON object.`;

async function callVertexAI(diff: string, projectId: string) {
  try {
    console.log("--- Vercel Function Triggered: Fail-Proof Auth ---");

    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      throw new Error("CRITICAL: GOOGLE_APPLICATION_CREDENTIALS_JSON is not set.");
    }
    
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

    const auth = new GoogleAuth({
      credentials,
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });

    const authToken = await auth.getAccessToken();
    console.log("--- Successfully generated auth token ---");

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
    console.log("--- Gemini API Call Successful ---");

    // FAIL-PROOF CHECK: Gracefully handle empty or safety-filtered responses from the AI
    const responseText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!responseText) {
      console.error("!!! AI returned an empty candidate. Full response:", JSON.stringify(responseData, null, 2));
      // Return a valid JSON structure indicating the failure
      return { 
        summary: "AI analysis could not be completed.",
        edgeCases: ["The AI returned no content, which may be due to safety filters or an issue with the input diff."],
        unitTests: { code: "// No tests generated due to empty AI response." }
      };
    }
    
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No valid JSON object found in the AI response.");
    }
    const jsonSubstring = responseText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonSubstring);

  } catch (error) {
    console.error("!!! VERTEX AI CALL FAILED (Fail-Proof Auth) !!!", error);
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
