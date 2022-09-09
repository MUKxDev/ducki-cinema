import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { supabase } from "../api/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
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
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Join Ducki Cinema and invite your loved ones to watch movies free
            togather!
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleLogin} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="email"
                className="input input-bordered"
              />
            </div>

            <div className="form-control mt-6">
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
    // <div className="prose mx-auto prose-blue prose-h1:text-primary my-6">
    //   <div
    //     className="bg-base-100 border border-base-200 rounded-2xl p-4 "
    //     aria-live="polite"
    //   >
    //     <h1 className="">Ducki Cinema</h1>
    //     <h4 className="description">
    //       Sign in via magic link with your email below
    //     </h4>
    //     {loading ? (
    //       "Sending magic link..."
    //     ) : (
    //       <form
    //         className="flex justify-between items-center"
    //         onSubmit={handleLogin}
    //       >
    //         <label htmlFor="email">Email</label>
    //         <input
    //           id="email"
    //           className="input input-bordered"
    //           type="email"
    //           placeholder="Your email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //         />
    //         <button
    //           className="btn btn-primary"
    //           aria-live="polite"
    //           type="button"
    //         >
    //           Send magic link
    //         </button>
    //       </form>
    //     )}
    //   </div>
    // </div>
  );
}
