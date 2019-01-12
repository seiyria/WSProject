import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { Image } from 'cloudinary-react';

import Property from '../partials/Builder/Card/Property';

class Card extends Component {
	render(){
		const { data } = this.props;
		return(
			<div className="container-card">
				{
				data ?
				<div className="card">		
					<div>{data.name || 'NaN'}</div>
					<div className='cardimage'>
					<Image cloudName="difwry0zl" publicId={data.image} >
					</Image>
					</div>
					<div className="cardtext">{data.cardText}</div>
					<div className="extra"> 
						<Row type='flex'>
							<Property name='Type' value={data.type} />
							<Property name='Level' value={data.level} />
							<Property name='Cost' value={data.cost} />						
							<Property name='Color' value={data.color} />
							<Property name='Power' value={data.power} />
							<Property name='Soul' value={data.soul} />
							<Property name='Card No' value={data.cardID} />
							<Property name='Trait' value={data.trait1} />
							<Property name='Trait' value={data.trait2} />
						</Row>
					</div>
				</div>
				: <span>No card found</span>
				}
			</div>
		)
	}
}

export default Card;