export default function registerRoutes (app) {
  app.get('/', (reg, res) => {
    res.send('hi');
  });
}
