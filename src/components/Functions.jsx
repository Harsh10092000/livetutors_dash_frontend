import React from 'react'
import moment from 'moment';

const Functions = () => {
  return (
    <div>
      
    </div>
  )
}


const PropertyTypeFunction = (val) => {
    return val?.split(",")[0];
  }




  export const priceFormat = (val) => {
    if (val < 100000) {
      return Intl.NumberFormat().format(val);
    } else if (val > 99999 && val < 10000000) {
      const lakh_number = val / 100000;
      return (
        lakh_number.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }) + " Lacs"
      );
    } else {
      const crore_number = val / 10000000;
      return (
          crore_number.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }) + " Crores"
      );
    }
  };
  
  
  export const ShowPrice = (pro_ad_type, pro_amt) => {
    return  pro_ad_type === "Sale" ? (
      "₹ " + priceFormat(pro_amt)
    ) : (
      <>
        ₹ {priceFormat(pro_amt)}
        <span className="slash-month"> /month</span>
      </>
    )
  }
  
  export const DateFormat = (date) => {
    return  moment(date).format("DD MMM, YY");
  }

  export const PropertyCurrentStatus = ({ val }) => {
    return (
      <div>
        {val === 1 ? 
            <div className='property-status-wrapper property-status-green' >Listed</div> : 
            val === 0 ?
            <div className='property-status-wrapper property-status-gray' >Delisted</div> :
            val === 3 ?
            <div className='property-status-wrapper property-status-orange' >Expiring</div> :
            val === 4 ?
            <div className='property-status-wrapper property-status-red' >Expired</div> :
            val === 5 ?
            <div className='property-status-wrapper property-status-blue' >Sold Out</div> : ""
        }
      </div>
    );
  };

  export const RequestTutorCurrentStatus = ({ val }) => {
    // Normalize status value
    const status = (val || '').toString().toLowerCase().replace(/[-_]/g, ' ');
    let label = status;
    let className = 'property-status-wrapper ';
    switch (status) {
      case 'pending':
        label = 'Pending';
        className += 'property-status-yellow';
        break;
      case 'in process':
        label = 'In Process';
        className += 'property-status-blue';
        break;
      case 'accepted':
        label = 'Accepted';
        className += 'property-status-green';
        break;
      case 'completed':
        label = 'Completed';
        className += 'property-status-purple';
        break;
      default:
        label = status.charAt(0).toUpperCase() + status.slice(1);
        className += 'property-status-gray';
    }
    return (
      <div className={className}>{label}</div>
    );
  }


  export default Functions
  export {PropertyTypeFunction}
  