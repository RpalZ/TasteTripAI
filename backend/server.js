const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`TasteTrip AI backend running on port ${PORT}`);
});
