import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';

class TopicSelector extends Component{
    state = {
        //selected_topic: undefined,
        topic: ['gun control', 'death penalty'],
        dropdownopen:false,
    }

    componentDidMount(){
        $('.dropdown-trigger').dropdown({hover:false});
        console.log(this.props.published)
        if(this.props.published){
            document.getElementById("publish_switch").checked = true;
        }
    }

    rendertopics(){
        //return (<div>{this.state.topic}</div>)
        return this.state.topic.map(topic=>{
            return (
                    <li key={topic}><a href="#" onClick={this.setTopic.bind(this, topic)}>{topic}</a></li>
            )
        })
    }

    dropdownswitch(){
        this.setState({dropdownopen:!this.state.dropdownopen})
    }

    setTopic(topic){
        Meteor.call('arguments.settopic', this.props.textid, topic)
        //this.setState({selected_topic: topic})
        this.dropdownswitch()
    }

    render(){
        return (<div style={{position:'relative'}}>
            <a className='dropdown-trigger btn' href='#' data-target='dropdown1' onClick={this.dropdownswitch.bind(this)}>{
                (this.props.topic==undefined || this.props.topic=='') ? "Select a topic" : "Topic : "+this.props.topic
            }</a>
            <ul id='dropdown1' className='dropdown-content' style={{display: (this.state.dropdownopen)?'block':'none', opacity: (this.state.dropdownopen)?'1':'0'}}>
                {this.rendertopics()}
            </ul>
            <div className="switch switch_publish"> 
                <label> 
                <input type="checkbox" id="publish_switch" onClick={this.props.publish_argument} disabled={this.props.prediction}/>
                <span className="lever"></span> 
                Publish to people!
                </label> 
            </div>
        </div>)
    }
}

export default TopicSelector;