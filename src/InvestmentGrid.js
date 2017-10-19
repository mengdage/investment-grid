import React from 'react'
import PropTypes from 'prop-types'
import FaCaretDown from 'react-icons/lib/fa/caret-down'
import FaCaretUp from 'react-icons/lib/fa/caret-up'
import { Grid, ScrollSync, AutoSizer } from 'react-virtualized'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import classnames from 'classnames'
import cloneDeep from 'lodash/cloneDeep'

import { getColors, convertMoney } from './utils'

import './InvestmentGrid.css'

const PLATFORM_ABBE = {
  facebook: 'FB',
  instagram: 'IG',
  twitter: 'TW',
  snapchat: 'SC',
  pinterest: 'PN',
  linkedin: 'LI'
}

class InvestmentGrid extends React.Component {
  constructor(props) {
    super(props)

    const {max, min} = this.getMaxMin(this.props.investmentData)
    const colors = getColors(this.props.levels, this.props.hexColor)
    this.state = {
      sortBy: '',
      ascending: false,
      max: max,
      min: min,
      colorScheme: colors,
      investmentData: cloneDeep(this.props.investmentData)
    }

    this.displayName = 'InvestmentGrid'

    this.renderBodyCell = this.renderBodyCell.bind(this)
    this.renderLeftHeaderCell= this.renderLeftHeaderCell.bind(this)
    this.renderLeftSideCell= this.renderLeftSideCell.bind(this)
    this.renderHeaderCell = this.renderHeaderCell.bind(this)
    this.changeSortBy = this.changeSortBy.bind(this)
    this.getMaxMin = this.getMaxMin.bind(this)

  }

  changeSortBy(keyword) {
    if(keyword === this.state.sortBy) {
      this.setState({
        ascending: !this.state.ascending
      })
    } else {
      this.setState({
        sortBy: keyword,
      })
    }
  }

  render() {
    const {
      columnWidth,
      leftColumnWidth,
      height,
      overscanRowCount,
      overscanColumnCount,
      rowHeight
    } = this.props

    const {
      sortBy,
      investmentData,
      ascending
    } = this.state

    const columnCount = this.props.platforms.length
    const rowCount = this.props.investmentData.length

    if(sortBy) {
      const factor = ascending ? 1 : -1
      if(sortBy === 'Brand'){
        investmentData.sort(function sortByBrand(brand1, brand2) {

          if(brand1['Brand']<brand2['Brand']) return -1 * factor
          if(brand1['Brand']>brand2['Brand']) return 1 * factor
          return 0
        })
      } else {
        investmentData.sort(function sortByPlatform(brand1, brand2) {
          const valueA = brand1['Investment'][sortBy]
          const valueB = brand2['Investment'][sortBy]

          return (valueA - valueB) * factor
        })
      }
    }
    return (
      <ScrollSync>
        {({
          clientHeight,
          clientWidth,
          onScroll,
          scrollHeight,
          scrollLeft,
          scrollTop,
          scrollWidth
        }) => {
          return (
            <div
              className='investment-grid'
              >
              <div
                className='left-column'
                >
                <div>
                  <Grid
                    className='column-header-grid'
                    cellRenderer={this.renderLeftHeaderCell}
                    width={leftColumnWidth}
                    height={rowHeight}
                    columnWidth={leftColumnWidth}
                    rowHeight={rowHeight}
                    rowCount={1}
                    columnCount={1}
                    sortBy={sortBy}
                    ascending={ascending}
                  />
                </div>

                <div>
                  <Grid
                    className='row-header-grid'
                    cellRenderer={this.renderLeftSideCell}
                    overscanColumnCount={overscanColumnCount}
                    overscanRowCount={overscanRowCount}
                    width={leftColumnWidth}
                    height={height - scrollbarSize()}
                    columnWidth={leftColumnWidth}
                    rowHeight={rowHeight}
                    rowCount={rowCount}
                    columnCount={1}
                    scrollTop={scrollTop}
                    sortBy={sortBy}
                    ascending={ascending}
                  />
                </div>
              </div>

              <div className='right-column'>
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <div>
                      <div
                        style={{
                          width: width - scrollbarSize()
                        }}
                        >
                          <Grid
                            className="column-header-grid"
                            cellRenderer={this.renderHeaderCell}
                            overscanColumnCount={overscanColumnCount}
                            width={width - scrollbarSize()}
                            height={rowHeight}
                            columnWidth={columnWidth}
                            rowHeight={rowHeight}
                            rowCount={1}
                            columnCount={columnCount}
                            scrollLeft={scrollLeft}
                            sortBy={sortBy}
                            ascending={ascending}
                          />
                      </div>

                      <div
                        style={{
                          height,
                          width
                        }}
                        >
                        <Grid
                          className="body-grid"
                          cellRenderer={this.renderBodyCell}
                          overscanColumnCount={overscanColumnCount}
                          overscanRowCount={overscanRowCount}
                          width={width}
                          height={height}
                          columnWidth={columnWidth}
                          rowHeight={rowHeight}
                          columnCount={columnCount}
                          rowCount={rowCount}
                          onScroll={onScroll}
                          sortBy={sortBy}
                          ascending={ascending}
                          containerStyle={{
                            color: '#fff',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </AutoSizer>
              </div>
            </div>
          )
        }

        }
      </ScrollSync>
    )
  }

  // get the max and min amount of Investment
  getMaxMin(fixtureData) {
    const { platforms } = this.props
    let max, min

    fixtureData.forEach(d => {
      const Investment = d['Investment']
      platforms.forEach(p => {
        if( typeof max === 'undefined') {
          max = Investment[p]
        } else {
          max = Investment[p] > max ? Investment[p] : max
        }

        if(typeof min === 'undefined') {
          min = Investment[p]
        } else {
          min = Investment[p] < min ? Investment[p] : min
        }
      })
    })
    max += 1
    return {
      max,
      min
    }
  }


  renderHeaderCell({columnIndex, key, rowIndex, style}) {
    const platform = this.props.platforms[columnIndex]
    const { sortBy, ascending, colorScheme } = this.state
    const sortable_up = <span className="icon-sort-asc"><FaCaretUp /></span>
    const sortable_down = <span className="icon-sort-dec"><FaCaretDown /></span>

    const ifChosen = sortBy.toLowerCase() === platform.toLowerCase()
    const classes = classnames('column-header-grid-cell','sortable', {
      'sort-asc': ifChosen && ascending,
      'sort-dec': ifChosen && !ascending
    })
    const newStyle = {
      ...style,
      color: colorScheme[colorScheme.length - 1]
    }

    return (
      <div className={classes} key={key} style={newStyle} onClick={()=>this.changeSortBy(platform)}>
        <div
          className='icon-sort-container'
          >
          {sortable_up}
          {sortable_down}
        </div>
        {PLATFORM_ABBE[platform.toLowerCase()]}
      </div>

    )
  }

  renderBodyCell({ columnIndex, key, rowIndex, style }) {
    const {
      min,
      max,
      colorScheme
    } = this.state

    const { levels } = this.props

    // Investment for one brand
    const investment = this.state.investmentData[rowIndex]['Investment']

    const amount = investment[this.props.platforms[columnIndex]]

    const colorLevel = Math.floor((amount-min)/((max-min)/levels))
    const textColor = colorLevel <= colorScheme.length/2 ? colorScheme[colorScheme.length-1] : colorScheme[0]
    const backgroundColor = colorScheme[colorLevel]

    const classes = classnames('body-cell')
    const newStyle = {
      ...style,
      color: textColor,
      backgroundColor: backgroundColor,
    }
    const hiddenDivStyle = {
      width: style.width,
      height: style.height,
      color: textColor,
      backgroundColor: backgroundColor
    }

    return (
      <div
        className={classes}
        key={key} style={newStyle}>
        {convertMoney(amount)}
        <div
          className="exact-amount"
          style={hiddenDivStyle}
          >
          {amount.toLocaleString()}
        </div>
      </div>)
  }

  renderLeftHeaderCell({columnIndex, key, style}) {
    const BRAND = 'Brand'

    const { sortBy, ascending, colorScheme } = this.state
    const sortable_up = <span className="icon-sort-asc"><FaCaretUp /></span>
    const sortable_down = <span className="icon-sort-dec"><FaCaretDown /></span>

    const ifChosen = sortBy.toLowerCase() === BRAND.toLowerCase()
    const classes = classnames('column-header-grid-cell','sortable', {
      'sort-asc': ifChosen && ascending,
      'sort-dec': ifChosen && !ascending
    })

    const newStyle = {
      ...style,
      color: colorScheme[colorScheme.length - 1]
    }

    return (
      <div
        className={classes}
        key={key}
        style={newStyle}
        onClick={()=>this.changeSortBy('Brand')}
        >
          <div
            className='icon-sort-container'
            >
            {sortable_up}
            {sortable_down}
          </div>
            {BRAND}
      </div>
    )
  }

  renderLeftSideCell({columnIndex, key, rowIndex, style}) {
    let classes = classnames('row-header-grid-cell')
    const { colorScheme } = this.state
    const newStyle = {
      ...style,
      color: colorScheme[colorScheme.length - 1]
    }
    return (
      <div
        className={classes}
        key={key}
        style={newStyle}>
        {this.state.investmentData[rowIndex]['Brand']}
      </div>
    )
  }
}

InvestmentGrid.propTypes = {
  columnWidth: PropTypes.number,
  leftColumnWidth: PropTypes.number,
  height: PropTypes.number,
  overscanColumnCount: PropTypes.number,
  overscanRowCount: PropTypes.number,
  rowHeight: PropTypes.number,
  levels: PropTypes.number,
  hexColor: PropTypes.string,
  // required
  investmentData: PropTypes.arrayOf(
    PropTypes.shape({
      Brand: PropTypes.string.isRequired,
      Investment: PropTypes.object.isRequired
    })).isRequired,
  platforms: PropTypes.arrayOf(PropTypes.string).isRequired
}

InvestmentGrid.defaultProps = {
  columnWidth: 100,
  leftColumnWidth: 200,
  height: 300,
  overscanColumnCount: 0,
  overscanRowCount: 5,
  rowHeight: 40,
  levels: 15,
  hexColor: '006F80'
}

export default InvestmentGrid
