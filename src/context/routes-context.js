// import React, { createContext, useState, useContext } from "react";
// import PropTypes from "prop-types"; // Import PropTypes
// import fileRoutes from "routes";

// const RoutesContext = createContext();

// export const useRoutes = () => useContext(RoutesContext);

// export const RoutesProvider = ({ children }) => {
//     const [routes, setRoutes] = useState(fileRoutes);

//     const updateRoutes = (accessiblePages) => {
//         const newRoutes = routes.filter((route) => accessiblePages.includes(route.key));
//         setRoutes(newRoutes);
//     };

//     return (
//         <RoutesContext.Provider value={{ routes, updateRoutes }}>
//             {children}
//         </RoutesContext.Provider>
//     );
// };

// // Add prop-types validation
// RoutesProvider.propTypes = {
//   children: PropTypes.node.isRequired, // children should be any renderable element
// };
