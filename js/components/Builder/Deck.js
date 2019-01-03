import React, { Component } from 'react';
import { List } from 'antd';

class Deck extends Component {

	handleItemHover = (card) =>{
		const { ViewCard } = this.props;
		ViewCard(card);
	}

	render(){
		const { handleItemHover } = this;
		const { cards } = this.props;
		return(
			<div className="container-deck">
				<div className="deck-header">
					{ cards.length }
				</div>
				<div className="deck-body">
					<div>Charicters</div>
					<div>Events</div>
					<div>Climaxes</div>
				</div>
			</div>
		)
	}
}

export default Deck;