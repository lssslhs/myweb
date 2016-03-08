+function() {
	'use strict';

	var mongoose = require('mongoose')
	,	Schema = mongoose.Schema;

	var JobListSchema = new Schema({
		username: {
			type: String,
			unique: true,
			required: true
		},

		joblist: [{
			id: {
				type: Number,
				unique: true
			},

			companyname: {
				type: String,
				default: 'none'
			},

			location: {
				type: String,
				default: 'none'
			},

			jobtitle: {
				type: String,
				default: 'none'
			},

			applydate: {
				type: Date,
				default: Date.now
			},

			status: {
				type: String,
				default: 'none'
			},

			interviewtime: {
				type: Date,
				default: Date.now
			}
		}]
	});

	JobListSchema.virtual("jobInfo").get(function(){
		return {
			joblist: this.joblist
		}
	});

	mongoose.model('JobList', JobListSchema);  
}();