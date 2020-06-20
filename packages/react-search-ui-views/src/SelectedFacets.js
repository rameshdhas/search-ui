import PropTypes from "prop-types";
import React from "react";



function SelectedFacets({
  className,
  searchTerm,
  clearFilters,
  removeFilter,
  filters,
  ...rest
}) {
  
 
  
  return (
     	  
     	  
     	   <div style={{marginTop:'30px', marginBottom:'30px'}}>
    		                
                         {filters.length > 0 &&
            			  <div  className="sui-facet">
            			  <div className="selection-title">
                              <h4 className="sui-facet__title">You Selected</h4>
                              <span className="sui-facet-clear" onClick={() => clearFilters()}>Clear All</span>
                           </div>
                           
                            <ul className="filtered-options">
                            
                            {filters.map((item, index) => (
                            	
                            	 item.values.map((value, valIndex) => (
                            		<li key={index + "-" + valIndex} className="job-type">
                            			<span>{value}</span>
                            			<span className="close-icon" onClick={() => removeFilter(item.field, value)}>x</span>
                            		</li> 
                            	 ))
                            	
                            	
                            ))}
                            
                            </ul>
                           </div>
                            }
                            
    	  </div>
    
  );
}



SelectedFacets.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  clearFilters: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  removeFilter: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default SelectedFacets;