
export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const requestBody = await context.request.json();
    const { image } = requestBody; // Base64 image string

    // API Key provided by user
    const API_KEY = "AIzaSyBPrbBtv36t1C4AERSNUP9TZ1MCqm3AwZ4";
    const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: image
            },
            features: [
              {
                type: "TEXT_DETECTION"
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
