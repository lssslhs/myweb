+function() {
	'use strict';

	var mongoose = require('mongoose')
	,	jwt = require('jwt-simple')
	,	authConfig = require('../../config/auth')
	,	util = require('../../lib/util.js');

	var JobList = mongoose.model('JobList');

	var JobListApi = {
		create: function(req, res, next) {
			var token = util.getToken(req.headers);

			if (token) {
				var decoded = jwt.decode(token, authConfig.localAuth.secret)
				, data = req.body;
				JobList.findOne({
					'username': decoded.local.username
				}, function(err, joblist){
					if (err) {
						throw err;
					}
					if (!joblist) {
						//create a joblist
						var newJobL = new JobList({
							username: decoded.local.username
						});
						data.id = 0;
						newJobL.joblist.push(data);
						console.log(newJobL);
						newJobL.save(function(err){
							if (err) {
								console.log(err);
								return res.json({
									success: false,
									msg: err
								});
							}

							res.json({
								success: true,
								msg: "Job created",
								job: data
							});
						});
					}
					else {
						if (joblist.joblist.length) {
							data.id = joblist.joblist[joblist.joblist.length-1].id + 1;
						}
						else {
							data.id = 0;
						}
						joblist.joblist.push(data);
						joblist.save(function(err) {
							if (err) {
								return res.json({
									success: false,
									msg: err
								});
							}

							res.json({
								success: true,
								msg: "Job created",
								job: data
							});
						});
					}

				});
			}
			else {
				return res.json({
		          success: false,
		          msg: "token not provided"
		        });
			}
		},

		getJoblist: function(req, res, next) {
			var token = util.getToken(req.headers);

			if (token) {
				var decoded = jwt.decode(token, authConfig.localAuth.secret)
				JobList.findOne({
					username: decoded.local.username
				},function(err, joblist){
					if (err) {
						throw err;
					}
					if (!joblist) {
						return res.json({
							success: false,
							msg: 'There is no joblist',
						});
					}
					else {
						return res.json({
							success: true,
							joblist: joblist.jobInfo
						});
					}
				});

			}
			else {
				console.log('no token');
				return res.json({
		          success: false,
		          msg: "token not provided"
		        });
			}
		},

		updateJob: function(req, res, next) {
			var token = util.getToken(req.headers);
			if (token) {
				var decoded = jwt.decode(token, authConfig.localAuth.secret);
				var data = req.body;
				JobList.update({
					username: decoded.local.username,
					'joblist.id': data.id
				},{'$set': {
					'joblist.$.companyname': data.companyname,
					'joblist.$.location': data.location,
					'joblist.$.jobtitle': data.jobtitle,
					'joblist.$.status': data.status,
					'joblist.$.interviewtime': data.interviewtime,
					'joblist.$.jobid': data.jobid,
					'joblist.$.applydate': data.applydate
				}}, function(err, test) {
					if (err) {
						throw err;
					}
					return res.json({
						success: true,
						msg: 'job updated'
					});
				});
			}
			else {
				return res.status(403).json({
					success: false,
					msg: "No token provided"
				});
			}
		},

		deleteJob: function(req, res, next) {
			var token = util.getToken(req.headers);
			if (token) {
				var decoded = jwt.decode(token, authConfig.localAuth.secret);
				var jid = req.query.jid;
				JobList.update({
					username: decoded.local.username, 
				},
				{
					$pull: {joblist: {id: jid}}
				}, function(err, test){
					if (err) {
						throw err;
					}

					return res.json({
						success: true,
						msg: 'job deleted'
					});
				})
			}
			else {
				return res.status(403).json({
					success: false,
					msg: "No token provided"
				});
			}
		}

	};

	module.exports = JobListApi;
}();