# GymBroS

A full-stack web application designed to manage gym operations, including member registration, check-ins, payments, and business analytics.

## Features

- **Dashboard:** At-a-glance view of key metrics like daily revenue, check-ins, active members, and expiring memberships.
- **Member Management:** Register, view, search, filter, and paginate through all gym members.
- **Check-in System:** Live attendance tracking with prevention of double check-ins.
- **Transaction Log:** A complete history of all payments with monthly filtering and CSV/PDF export options.
- **Admin Panel:** An interface to create, edit, and delete membership plans.
- **Responsive Design:** A clean UI that works on desktop, tablet, and mobile devices.

## How to Run Locally

1.  **Start Backend & Database:**
    ```bash
    docker-compose up
    ```

2.  **Start Frontend:** In a separate terminal, navigate to the `client` folder and run:
    ```bash
    cd client
    npm run dev
    ```

3.  Open your browser and go to `http://localhost:5173`.
