'use strict'

const showRosterTemplate = require('../templates/roster-listing.handlebars')
const showTopSevenTemplate = require('../templates/top-seven.handlebars')
const store = require('../store')

const topSeven = []

const getPlayersSuccess = function (data) {
  store.players = data.players
  const showRosterHtml = showRosterTemplate({ players: store.players })
  $('.roster').empty()
  $('.roster').append(showRosterHtml)
  store.players = null
  $('#roster').text('Ironside Roster ' + store.year)
  seasonResults(store.year)
}

const getPlayersFailure = function () {
  $('.roster').text('An error occurred accessing this roster. Please try again.')
}

const postTeamSuccess = function (data) {
  topSeven.push(data.team)
  displayTopSeven()
  if (topSeven.length < 7) {
    $('#patch-message').text('Player Successfully Added')
  } else {
    $('#patch-message').text('Your team is set. Select `All-Time Rosters` to see your team.')
  }
}

const postTeamFailure = function () {
  $('#patch-message').text('This player has already been selected. Please choose another player.')
}

const signInTopSevenSuccess = function (data) {
  topSeven.length = 0
  data.teams.forEach(function (data) {
    if (data.team_name === store.teamName && data.user.id === store.user.id) {
      topSeven.push(data)
    }
  })
  displayTopSeven()
}

const signInTopSevenFailure = function () {
  $('.topseven').text('An error occurred accessing your top seven picks.')
}

const displayTopSeven = function () {
  $('.year').show()
  $('.roster').show()
  $('.topseven').show()
  const showTopSevenHtml = showTopSevenTemplate({ data: topSeven })
  $('.topseven').text('')
  $('.topseven').append(showTopSevenHtml)
}

const deletePlayerSuccess = function (data) {
  displayTopSeven()
  $('#patch-message').text('Player Successfully Deleted')
}

const deletePlayerFailure = function () {
  $('.topseven').text('An error occurred deleting this player. Please try again.')
}

const seasonResults = function (data) {
  if (data === 2008) {
    $('#results').text('2008 Season: Record: 42-5, Finish: 2nd')
  } else if (data === 2009) {
    $('#results').text('2009 Season: Record: 42-6, Finish: 3rd')
  } else if (data === 2010) {
    $('#results').text('2010 Season: Record: 52-1, Finish: 2nd')
  } else if (data === 2011) {
    $('#results').text('2011 Season: Record: 0-0, Finish: 2nd')
  } else if (data === 2012) {
    $('#results').text('2012 Season: Record: 0-0, Finish: 3rd')
  } else if (data === 2013) {
    $('#results').text('2013 Season: Record: 0-0, Finish: 3rd')
  } else if (data === 2014) {
    $('#results').text('2014 Season: Record: 0-0, Finish: 2nd')
  } else if (data === 2015) {
    $('#results').text('2015 Season: Record: 17-11, Finish: 3rd')
  } else if (data === 2016) {
    $('#results').text('2016 Season: Record: 26-2, Finish: 1st')
  } else {
    $('#results').text('2017 Season: Record: 27-9, Finish: 5th')
  }
}

module.exports = {
  getPlayersSuccess,
  getPlayersFailure,
  signInTopSevenSuccess,
  signInTopSevenFailure,
  topSeven,
  deletePlayerSuccess,
  deletePlayerFailure,
  postTeamSuccess,
  postTeamFailure
}
