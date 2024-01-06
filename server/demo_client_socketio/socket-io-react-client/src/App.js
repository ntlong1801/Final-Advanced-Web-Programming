import io from 'socket.io-client';
import { useEffect } from 'react';

const socket = io('http://localhost:5000'); // Replace with your server URL
var count = 0;
const App = () => {
  socket.on("notificationFeedBackOnReview", (arg) => {
    console.log(arg);
  });
  useEffect(() => {
    // Get the client ID from the server
    socket.on('connect', () => {
      const clientId = socket.id;
      const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZmEzMGZlYS1kZjJhLTQ3ZTgtOWIwYS0yYjgwNjA2ZDNjMzUiLCJpYXQiOjE3MDQ0NzQ3MjAsImV4cCI6MTcwNDU2MTEyMH0.1QmFk81riXjTwCh6PDxmUD__PUVWqox4kj_aXCoR-fU';

      // Make an HTTP request to the server with the client ID
      fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body:
          JSON.stringify({
            clientId: clientId,
            email: "example@gmail.com",
            password: "example_password",
          }),
      });
      // the problem is this code will fetch twice, i have tried to fix but hopeless, gud luk : > (maybe the problem is about rendering),
      // if you apply socketIO into our front-end without having above problem, just ignore this message!
      count++;
      console.log(count);


    });
  }, []);

  return (
    <div>
      <h1>Socket.IO React Client</h1>

    </div>
  );
};

export default App;
