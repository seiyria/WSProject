import { Component } from 'react';
import { Row, Col, Select, List, message } from 'antd';
const { Option } = Select;

import TranslationCard from './TranslationCard';
import CardItemIcon from 'Partials/Builder/CardItem/CardItemIcon';

import TranslationsStore from '../../stores/TranslationsStore';
import { fetchSeries, fetchTranslations, saveTranslations } from 'Utils/api';
import { savedTranslations } from 'Actions/TranslationActions'

import {
  receiveSeries
} from 'Actions/BuilderActions';

import {
	receiveTranslations
} from 'Actions/TranslationActions';

const buildState = () => ({
  serieses: TranslationsStore.getSerieses(),
  cards: TranslationsStore.getSeries(),
  translations: TranslationsStore.getTranslations()
});

class Translations extends Component {

	state = {
		...buildState(),
		selectedseries: undefined,
		selectedcard: null,
		selectedindex: 0,
		focusedability: 0,
		saving: false
	}

	onChange = () => this.setState(buildState);

	componentDidMount() {
		TranslationsStore.addChangeListener(this.onChange);
		document.addEventListener("keydown", this.handleKeyDown);
		//this.handleSeriesSelect('5ccddc33f364535e091ac562')
	}

	componentWillUnmount() {
		TranslationsStore.removeChangeListener(this.onChange);
		document.removeEventListener("keydown", this.handleKeyDown);
	}

	handleSelectCard = (selectedindex) => {
		const { cards, translations } = this.state;
		let selectedcard = cards[selectedindex];

		this.setState({ selectedcard, selectedindex })
	}

	handleSeriesSelect = async(id) =>{
		const { selectedseries, translations } = this.state;

		if( selectedseries ){
			const pendingtrans = translations.findIndex((t) => t.edited === true)

			if( pendingtrans >= 0 ){
				message.warn("You have unsaved changes")
				return false;
			}
		}

		const [
			seriescards,
			dbtranslations
		] = await Promise.all([
			fetchSeries(id),
			fetchTranslations(id)
		]);

		receiveTranslations(dbtranslations);
    	receiveSeries(seriescards);
    	this.handleSelectCard(0);
    	this.setState({selectedseries: id})
  	}

  	handleSave = async() =>{
  		const { selectedseries, translations } = this.state;

  		this.setState({saving: true});
  		const res = await saveTranslations(selectedseries, translations)
  		if( res.success ){
  			savedTranslations()
  			message.info("Save complete")
  		}
  		else{
  			message.error("Save Failed :(")
  		}
  		this.setState({saving: false})
  	}

  	handleKeyDown = (e) =>{
  		let { selectedindex, cards } = this.state;
  		switch( e.keyCode ) {
	        case 39:
	        case 40:
	        	selectedindex = selectedindex < cards.length ? selectedindex + 1 : selectedindex;
	            break;
	        case 37:
	        case 38:
	        	selectedindex = selectedindex > 0 ? selectedindex - 1 : selectedindex;
	        	break;
	        default: 
	        	return false;
	            break;
	    }
	    this.handleSelectCard(selectedindex)
  	}

	render(){
		const { handleSeriesSelect, handleSave } = this;
		const { serieses, cards, selectedcard, selectedseries, saving } = this.state;

		return(
		  <div className="container-translations">
		  	<Row gutter={14} style={{marginBottom:'5px'}}>
		  		<Col span={24}>
		  			<Select
		  				showSearch
		  				placeholder="Pick a series"
		  				style={{width:'100%'}}
		  				onChange={handleSeriesSelect}
		  				value={selectedseries}
		  				filterOption={(input, option) =>
					      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
					    }
		  			>
		  			{
		  				serieses.map( (series, i) => 
		  					<Option value={series._id} key={i}>
		  						{`${series.name} (${series.set}/${series.side}${series.release})`}
		  					</Option> 
		  				)
		  			}
		  			</Select>
		  		</Col>
		  	</Row>
		  	<Row gutter={16}>
			  	<Col span={18}>
				  	{
				  		selectedcard ?
				  		<TranslationCard key={selectedcard._id} card={selectedcard} handleSave={handleSave} saving={saving}/>
				  		:
				  		<div>
				  			<h1 style={{textAlign: 'center'}}>
				  				Select a Series Above
				  			</h1>
				  		</div>
				  	}	
				</Col>
				<Col span={6}>
					<div className="card-list">
						<List 
							dataSource={cards}
							renderItem={(card, i) => (
						        <List.Item 
									className={`card-item ${selectedcard && card._id === selectedcard._id ? 'selected' : ''} ${ card.translation.edited === true ? 'highlight-alert' : '' }
									`}>
										<List.Item.Meta 
											className="clickable"
											onClick={ () => this.setState({selectedcard: card, selectedindex: i}) }
											avatar={<CardItemIcon card={card} />}
											title={`${card.locale.name}`}
										/>
									</List.Item>
						      )}
						>
						</List>
					</div>
				</Col>
		  	</Row>	  	
		  </div>
		)
	}
}

export default Translations;