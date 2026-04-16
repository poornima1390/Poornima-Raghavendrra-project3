import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MyPokemon from './pokemon/MyPokemon'
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from './pokemon/Login';
import AllPokemon from './pokemon/AllPokemon';


const router = createBrowserRouter([
  {
    path: "/",
    element: <MyPokemon />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/allpokemon",
    element: <AllPokemon />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
