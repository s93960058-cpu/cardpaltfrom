import { useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function AuthHandler() {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          console.log("🔐 משתמש מחובר:", session.user.email);
          // מנקה את ה־hash מהכתובת
          window.location.hash = "";
          // מפנה לדשבורד
          window.location.href = "/dashboard";
        }
      }
    );

    // במידה שכבר יש סשן שמור (המשתמש התחבר בעבר)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        console.log("משתמש כבר מחובר:", data.session.user.email);
        window.location.href = "/dashboard";
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return null;
}
