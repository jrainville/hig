import { Table as VanillaTable } from "hig-vanilla";
import PropTypes from "prop-types";
import React, { Component } from "react";
import HeaderCheckbox from "./HeaderCheckbox";
import RowCheckbox from "./RowCheckbox";

export default class SelectableTable extends Component {
  constructor(props) {
    super(props);

    const initialSelections = this.props.data.reduce(
      (selections, row) => ({ ...selections, [row.id]: row.selected }),
      {}
    );
    this.state = {
      rowsSelected: initialSelections
    };
  }

  selectRow = rowInfo => {
    const newRows = {
      ...this.state.rowsSelected,
      [rowInfo.id]: rowInfo.selected
    };
    this.setState({ rowsSelected: newRows });
  };

  handleAllSelectionChange = event => {
    this.props.data.forEach(row =>
      this.handleRowCheckboxOnChange({
        id: row.id,
        selected: event.target.checked
      })
    );
    this.props.onSelectAllSelectionChange({ selected: event.target.checked });
  };

  handleRowCheckboxOnChange = rowInfo => {
    this.selectRow(rowInfo);
    this.props.onRowSelectionChange(rowInfo);
  };

  checkboxHeader = () => ({
    id: "checkboxHeader",
    alignment: "center",
    width: "50px",
    HeaderCell: () => (
      <HeaderCheckbox
        onSelectAllSelectionChange={this.handleAllSelectionChange}
        selected={this.renderedAllRowsSelected()}
        style={{ background: "red" }}
      />
    ),
    Cell: props => (
      <RowCheckbox
        id={props.data.id}
        selected={props.data.selected}
        onChange={this.handleRowCheckboxOnChange}
      />
    )
  });

  mergeRowState = row => ({
    ...row,
    selected: this.state.rowsSelected[row.id]
  });

  renderedAllRowsSelected() {
    const rowSelections = Object.values(this.state.rowsSelected);
    return rowSelections.every(value => value);
  }

  render() {
    const columns = [this.checkboxHeader()].concat(this.props.columns);
    const enhancedData = this.props.data.map(this.mergeRowState);
    return this.props.children(columns, enhancedData, this.props.density);
  }
}

SelectableTable.propTypes = {
  /**
   * Sets the size of the table
   */
  density: PropTypes.oneOf(VanillaTable.AvailableDensities),
  /**
   * Provides content table cells
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      selected: PropTypes.bool
    })
  ),
  /**
   * Called when user selects or deselects a row
   */
  onRowSelectionChange: PropTypes.func,
  /**
   * Function to render the table. Signature is fn(columns, data, density)
   */
  children: PropTypes.func,
  /**
   * Called when user checks or unchecks the select-all checkbox
   */
  onSelectAllSelectionChange: PropTypes.func,
  /**
   * Provides content for header cells
   */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string,
      alignment: PropTypes.alignment,
      width: PropTypes.string,
      id: PropTypes.string,
      Cell: PropTypes.any
    })
  )
};

SelectableTable.defaultProps = {
  columns: [],
  data: [],
  onSelectAllSelectionChange: () => {},
  onRowSelectionChange: () => {}
};
