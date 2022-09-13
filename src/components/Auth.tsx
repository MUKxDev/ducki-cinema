import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { useAppContext } from "../context/appContext";

export default function Auth() {
  const { auth } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e: any) => {
    e?.preventDefault();

    try {
      setLoading(true);
      const { error } = await auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      if (error instanceof AuthError) {
        alert(error.name || error.message);
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="flex-col hero-content lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Join Ducki Cinema and invite your loved ones to watch movies free
            togather!
          </p>
        </div>
        <div className="flex-shrink-0 w-full max-w-sm shadow-2xl card bg-base-100">
          <form onSubmit={handleLogin} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="email"
                className="input input-bordered"
              />
            </div>

            <div className="mt-6 form-control">
              <button
                type="submit"
                aria-live="polite"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
              >
                Send Magic Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
