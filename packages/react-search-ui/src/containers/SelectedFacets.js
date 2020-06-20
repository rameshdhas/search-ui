import PropTypes from "prop-types";
import { Component } from "react";

import { withSearch } from "..";
import { SelectedFacets } from "@elastic/react-search-ui-views";

export class SelectedFacetsContainer extends Component {

  static propTypes = {
    // Props
    className: PropTypes.string,
    view: PropTypes.func,
    // State
    resultSearchTerm: PropTypes.string.isRequired,
    filters: PropTypes.array.isRequired,
    clearFilters: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired
  };

  render() {
    
	const {
      className,
      resultSearchTerm,
      clearFilters,
      removeFilter,
      filters,
      view,
      ...rest
    } = this.props;

    const View = view || SelectedFacets;

    return View({
      className,
      searchTerm: resultSearchTerm,
      clearFilters: clearFilters,
      removeFilter: removeFilter,
      filters: filters,
      ...rest
    });
  }
}

export default withSearch(
  ({ resultSearchTerm, filters, clearFilters, removeFilter }) => ({
    resultSearchTerm,
    filters,
    removeFilter,
    clearFilters
  })
)(SelectedFacetsContainer);	