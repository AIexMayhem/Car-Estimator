# Car-Estimator
Web app used to predict car prices by car specifications.

## Launch

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the Python backend so the API is available at `http://localhost:6969/car`.
3. Install frontend dependencies:
   ```bash
   cd Car_Estimator
   npm install
   ```
4. Start the React frontend in development mode:
   ```bash
   npm run dev
   ```
5. Open [localhost:5173](http://localhost:5173/).

## Production frontend

```bash
cd Car_Estimator
npm run build
npm start
```

`npm start` serves the built React app with Express. By default it uses port `80`; set `PORT` if you need another port.

[Figma link](https://www.figma.com/design/CfgJgK4OwEes9OjVOWYBWi/CAR-ESTIMATOR?m=dev&node-id=0%3A1&t=NAbd90A9XBCEjKmu-1)\
[Google Collab link](https://colab.research.google.com/drive/10jpg2uX0paPm-am67XX5Pg7iLZcLZYec?usp=sharing)

Tech-lead: Ospelnikov Alexey\
Idea author: Grigory Kapustin\
Frontend: Ospelnikov Alexey, Yakshin Artemiy\
Design: Yakshin Artemiy, Ospelnikov Alexey\
Backend: Ospelnikov Alexey, Ananiev Nikita, Yakshin Artemiy\
Data-science: Grigory Kapustin, Maxim Mordovkin, Ospelnikov Alexey, Ananiev Nikita


Stack: React + Vite, Node.js + Express, Python + Flask
