import './text-cell.scss'
var Template = require("./text-cell.html");
var Interface = require("interface.json");
var Core = require("_core.js");


const TextCellContent = require('../text-cell-content/text-cell-content.js')

class TextCell extends Core {
	constructor(options = {}) {
    super(options);
		this._render(Template, options, undefined, "tr");
		this.initialOptions = options
	}

	_componentDidMount(){
		this.textCellContent = new TextCellContent(this.initialOptions)
		this.mountPartialToComment("TEXT-CELL-CONTENT", this.textCellContent)
	}


	setText(text) {
		if(this.textCellContent) {
			this.textCellContent.setText(text);
		}
  }

  setDetail(detail) {
		if (this.textCellContent) {
			this.textCellContent.setDetail(detail);
		}
	}

  setAlignment(position) {
		if (this.textCellContent) {
			this.textCellContent.setAlignment(position);
		}
  }
}

TextCell._interface = Interface["components"]["Table"]["partials"]["TableRow"]["partials"]["TextCell"];


TextCell._defaults = {
}
TextCell._partials = {};

module.exports = TextCell;