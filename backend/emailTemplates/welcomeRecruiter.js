export const welcomeRecruiterEmail = (name) => `
  <div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:30px;">
    <div style="max-width:600px; margin:auto; background:white; padding:25px; border-radius:10px; 
                box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <h2 style="color:#1f2e55; text-align:center; margin-bottom:10px;">
        Welcome, Recruiter 👔
      </h2>

      <p style="font-size:15px; color:#333;">
        Hello <b>${name}</b>,  
        <br><br>
        Your recruiter account has been successfully created on 
        <b style="color:#6A38C2;">Opportunity</b>.
        You can now post jobs and find the best talent easily.
      </p>

      <div style="background:#1f2e55; padding:15px; border-radius:8px; color:white; margin:20px 0; text-align:center;">
        Start posting jobs and manage applications with ease.
      </div>

      <div style="text-align:center">
        <a href="https://opportunity-portal.vercel.app/admin/jobs"
           style="background:#6A38C2; padding:12px 22px; color:white; text-decoration:none; 
                  border-radius:6px; display:inline-block; font-size:15px;">
          Post a Job
        </a>
      </div>

      <p style="font-size:14px; color:#555; margin-top:25px;">
        Regards,<br>
        <b>Opportunity Hiring Team</b>
      </p>

    </div>
  </div>
`;
