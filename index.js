// Import CACCL
const initCACCL = require('caccl/server/react');


// Initialize CACCL
const app = initCACCL();

// ^ App is an express app. Add routes the usual way.
app.get('/name', async (req, res) => {
    const profile = await req.api.user.self.getProfile();
    return res.send(profile.name);
  });
  