import React from "react";
import "./table.css";

const TableHead = ({theadArray}) => {
  // Updated sample data for the poultry farm with email, mobile, and address


  return (
    
      <div className="div-table-header">
        {/* <div className="div-table-cell">ID</div>
        <div className="div-table-cell div-table-cell-email">Breed</div>
        <div className="div-table-cell">Age (weeks)</div>
        <div className="div-table-cell">Eggs/Day</div>
        <div className="div-table-cell">Status</div>
      
        <div className="div-table-cell">Mobile</div>
        
        <div className="div-table-cell">Address</div> */}
        {theadArray.map((item, index) => (
          <div className={`div-table-cell ${item.customClass ? item.customClass : ""}`}>{item.value}</div>
        ))}

      </div>
      
   
  );
};

export default TableHead;