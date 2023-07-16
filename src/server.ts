import app from "./app";

const port = 3002;
app
  .listen(port, () => {
    console.log(`Running on port ${port}`);
  })
  .on("error", (error) => {
    let errorMessage = "Unexpected error at server startup";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
  });
