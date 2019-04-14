import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import TopicSelector from './topic_selector'

class TextInput extends Component{
    argument="Write your an interesting argument here. Write your an interesting argument here. Write your an interesting argument here. Write your an interesting argument here.Let's see whether we can write over two lines. It would be an interesting experience."
    feedback= [
        {
            ontextposition: 0,
            ontext: 'Write your an interesting argument here.',
            comment: 'comment 1 and comment is so short',
            resolved: false,
        },
        {
            ontextposition: 41,
            ontext: 'Write your an interesting argument here.',
            comment: 'comment2 and this should be longer one dued comment2 and this should be longer one dued comment2 and this should be longer one dued comment2 and this should be longer one dued',
            resolved: false,
        }
    ]

    /*getIndicesOf(searchStr, str, caseSensitive=true) {
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        var startIndex = 0, index, indices = [];
        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }*/

    componentDidMount(){
        document.getElementById("argument_draft").value = this.props.argument;
        var with_drafts = document.getElementsByClassName("with_draft")
        for (var i=0; i< with_drafts.length; i++){
            if (i!='length')
                with_drafts[i].style.height = document.getElementById("argument_draft").scrollHeight+'px'
        }
    }

    checkoverlap(textarea_start, textarea_end){
        for (var i in this.props.feedback){
            var comment_start = this.props.feedback[i]['ontextposition']
            var comment_end = comment_start + this.props.feedback[i]['ontext'].length
            console.log(comment_start, comment_end)
            if (comment_start>textarea_end || comment_end<textarea_start){
                continue
            }else{
                this.props.focus_comment(i)
                return true
            }
        }
        return false
    }

    updateText(){
        console.log('h')
        //var textarea_original = document.getElementById("argument_draft").value
        console.log(this.props.argument)
        var textarea_start = document.getElementById("argument_draft").selectionStart
        var textarea_end = document.getElementById("argument_draft").selectionEnd
        console.log(textarea_start, textarea_end)
        console.log(this.checkoverlap(textarea_start, textarea_end))
        // below for forcing reflection
        if (this.checkoverlap(textarea_start, textarea_end)){
            alert("Please reflect on the feedback before you proceed to revise your argumentation.")
            
            document.getElementById("argument_draft").value = this.props.argument
            document.getElementById("argument_draft").selectionStart = textarea_start-1
            document.getElementById("argument_draft").selectionEnd = textarea_end-1
            
        }else{
            //this.props.argument = document.getElementById("argument_draft").value
            var with_drafts = document.getElementsByClassName("with_draft")
            for (var i=0; i< with_drafts.length; i++){
                if (i!='length')
                    with_drafts[i].style.height = document.getElementById("argument_draft").scrollHeight+'px'
            }
            // update text to backend
            this.props.updateText(document.getElementById("argument_draft").value);
        }
    }

    selectText(){
        var sel_start = document.getElementById("argument_draft").selectionStart
        var sel_end = document.getElementById("argument_draft").selectionEnd
        var selected = -1;
        var selected_sim = 0;
        for(var i in this.props.feedback){
            var cur_comment = this.props.feedback[i]
            var cm_start = cur_comment['ontextposition']
            var cm_end = cm_start + cur_comment['ontext'].length
            console.log(sel_start, sel_end, cm_start, cm_end)
            if(sel_start>cm_end || sel_end<cm_start){
                continue
            }

            var sm_start = (sel_start<cm_start)? cm_start : sel_start;
            var sm_end = (sel_end > cm_end) ? cm_end : sel_end;

            var precision = (sm_end-sm_start+1)/(sel_end-sel_start+1)
            var recall = (sm_end-sm_start+1)/(cm_end-cm_start+1)
            console.log(precision, recall)
            if (precision + recall == 0){
                continue
            }else{
                var score = 2*precision*recall/(precision+recall)
                if (score>selected_sim){
                    selected_sim = score
                    selected = i
                }
            }
        }
        console.log(selected)
        this.props.focus_comment(selected)
    }

    renderFeedbackOnText(){
        return this.props.feedback.map((comment_content, idx)=>{
            // only render comment when it is resolved
            if (comment_content['resolved']==false){
                var start_index = comment_content['ontextposition']
                var end_index = start_index + comment_content['ontext'].length
                var color = '#aaaaaa';
                if (idx == this.props.focused_comment){
                    color= 'yellow'
                }
                var replaced = this.props.argument.substr(0, start_index)+"<span class='writemode_comment' style='background-color: "+color+"; opacity: 0.3'>"+comment_content['ontext']+'</span>'+this.props.argument.substr(end_index+1, this.props.argument.length)
                return (<div onMouseOver={this.props.focus_comment.bind(this, idx)}
                className='with_draft card-panel writemode_comment_encloser' dangerouslySetInnerHTML={{__html:replaced}}>
                </div>)
            }
        })
    }

    render(){
        console.log($(window).height())
        var textarea_height = $(window).height()- (10+64+14.5+36+7.25+14+20+10)
        console.log(textarea_height)
        return (<div className='col s8'>
        <TopicSelector topic={this.props.topic} textid={this.props.textid} 
        prediction={this.props.prediction} published={this.props.published}
        publish_argument={this.props.publish_argument}></TopicSelector>
        <div style={{'position':'relative'}}>       
            <textarea id="argument_draft" onChange={this.updateText.bind(this)} onMouseUp={this.selectText.bind(this)}
            onKeyUp={this.selectText.bind(this)}
            style={{backgroundColor:(this.props.prediction)?'#eeeeee':'transparent'}}
            className="with_draft card-panel" seamless='seamless' disabled={this.props.prediction}></textarea> 
            {this.renderFeedbackOnText()} 
        </div>
        </div>)
    }
}

export default TextInput;