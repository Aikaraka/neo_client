import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// neo_server의 주소. 환경 변수에서 가져옵니다.
const NEO_SERVER_URL = Deno.env.get("NEO_SERVER_URL");

Deno.serve(async (req) => {
  // CORS preflight 요청 처리
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. 요청에서 인증 토큰 추출
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }
    const jwt = authHeader.replace("Bearer ", "");

    // 2. Supabase Admin 클라이언트로 토큰 유효성 검증
    const supabaseAdmin = createClient(
      Deno.env.get("PROJECT_SUPABASE_URL")!,
      Deno.env.get("PROJECT_SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);

    if (userError) {
      console.error("User validation error:", userError.message);
      return new Response("Authentication failed", { status: 401, headers: corsHeaders });
    }
    if (!user) {
       return new Response("User not found", { status: 401, headers: corsHeaders });
    }
    
    // 3. neo_server로 요청 스트리밍
    const { pathname, search } = new URL(req.url);
    // Edge function의 경로 부분(/streaming-proxy)을 제거하고 실제 neo_server의 엔드포인트를 만듭니다.
    // 예: /streaming-proxy/process-input -> /process-input
    const targetEndpoint = pathname.replace("/streaming-proxy", "");
    const targetUrl = `${NEO_SERVER_URL}${targetEndpoint}${search}`;
    
    // 4. neo_server로 요청을 그대로 전달 (body와 헤더 포함)
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader, // 기존 인증 헤더를 그대로 전달
      },
      body: req.body,
    });

    // 5. neo_server의 응답을 클라이언트로 스트리밍
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });

  } catch (error) {
    console.error("Proxy error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});