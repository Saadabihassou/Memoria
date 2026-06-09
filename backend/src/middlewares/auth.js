import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization; // This is used to retrieve the value of the Authorization header from the incoming HTTP request. This header typically contains the authentication token (e.g., a JWT token) that the client sends to the server to prove its identity. The server will then use this token to verify the client's authenticity and grant access to protected resources if the token is valid.

    if (!header) {
      return res.status(401).json({ message: "No token" });
    }

    const token = header.split(" ")[1]; // This line is used to extract the actual token from the Authorization header. The header is expected to be in the format "Bearer <token>".

    // Verify the token: The jwt.verify function is used to verify the authenticity of the JWT token. It takes the token and a secret key (which should be kept secure and not hardcoded in the code) as arguments. If the token is valid, it returns the decoded payload (in this case, the user ID). If the token is invalid or expired, it will throw an error, which is caught in the catch block, resulting in a 401 Unauthorized response being sent back to the client.
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET, // Use a secret key from environment variables for verifying the token
    );

    req.userId = decoded.userId; // This line assigns the user ID extracted from the decoded token to the req.userId property. This allows subsequent middleware functions or route handlers to access the authenticated user's ID, enabling them to perform actions on behalf of that user or to check permissions.

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
