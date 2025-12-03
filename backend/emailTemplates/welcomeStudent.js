export const welcomeStudentEmail = (name) => `
  <div style="font-family: Arial, sans-serif; background:#f5f7ff; padding:30px;">
    <div style="max-width:600px; margin:auto; background:white; padding:25px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

      <h2 style="color:#6A38C2; text-align:center; margin-bottom:10px;">
        Welcome to <span style="color:#F83002;">Opportunity</span> 🎉
      </h2>

      <p style="font-size:15px; color:#333;">
        Hi <b>${name}</b>,  
        <br><br>
        We're excited to have you on board! Your journey towards finding the best opportunities begins here.
      </p>

      <div style="background:#6A38C2; padding:15px; border-radius:8px; color:white; margin:20px 0; text-align:center;">
        Start exploring jobs that match your skills and interests!
      </div>

      <div style="text-align:center">
        <a href="http://localhost:5173/jobs"
           style="background:#F83002; padding:12px 22px; color:white; text-decoration:none; 
                  border-radius:6px; display:inline-block; font-size:15px;">
          Explore Jobs
        </a>
      </div>

      <p style="font-size:14px; color:#555; margin-top:25px;">
        Best wishes,<br>
        <b>Team Opportunity</b>
      </p>

    </div>
  </div>
`;
