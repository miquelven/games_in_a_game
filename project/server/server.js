import express from "express";
import { envs, Client } from "stytch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const client = new Client({
  project_id: process.env.PROJECT_ID,
  secret: process.env.SECRET,
  env: envs.test,
});

const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { email, password, first_name } = req.body;

  try {
    const resp = await client.passwords.create({
      email,
      password,
      name: {
        first_name,
      },
      session_duration_minutes: 150,
    });

    res.json({
      success: true,
      message: "success",
      user_id: resp.user.user_id,
      name: resp.user.name.first_name,
      token: resp.session_token,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.error_message,
      err: err,
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const resp = await client.passwords.authenticate({
      email,
      password,
      session_duration_minutes: 150,
    });

    res.json({
      success: true,
      message: "logged",
      token: resp.session_token,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.error_message,
      err: err,
    });
  }
});

app.post("/authenticate", async (req, res) => {
  const { session_token } = req.body;

  try {
    await client.sessions.authenticate({ session_token });

    res.json({
      success: true,
      message: "logged",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.error_message,
      err: err,
    });
  }
});

app.post("/logout", async (req, res) => {
  const { session_token } = req.body;

  try {
    await client.sessions.revoke({ session_token });
    res.json({
      success: true,
      message: "logged",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.error_message,
      err: err,
    });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  try {
    await client.passwords.email
      .resetStart({
        email,
        reset_password_expiration_minutes: 5,
        locale: "pt-br",
      })
      .then((resp) => {
        console.log(resp);
      });
  } catch (err) {
    console.log(err);
  }
});

app.post("/togglepassword", async (req, res) => {
  const { token, password } = req.body;
  try {
    await client.passwords.email
      .reset({
        token,
        password,
      })

      .then((resp) => {
        resp.json({
          success: true,
          message: "logged",
        });
      });
  } catch (err) {
    res.json({
      success: false,
      message: err.error_message,
      err: err,
    });
  }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
