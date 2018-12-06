import Syncano from '@syncano/core'

export default async ctx => {
  const {event, endpoint} = new Syncano(ctx)
  const {text, sender} = ctx.args

  if (text.toLowerCase().indexOf('hello') >= 0) {
    event.emit('messenger-bot.message-send', {text: `Hi, this is Syncano Weather bot 😎 
To check the weather, please type your city name in your message ie. Oslo  `, sender} )
  } else if (text.toLowerCase().indexOf('help') >= 0) {
    event.emit('messenger-bot.message-send', {text: `It looks like you need some help 🤔 
To check the weather, please type your city name in your message ie. Oslo  `, sender} )
  } else {
    try {
      const forecast = await endpoint.post('openweathermap/get-three-hours', {city: text})
      // Creating response message
      const response = ['In the next few hours you can expect:']
      let rain = false
      forecast.forEach(prediction => {
        response.push(`${prediction.hour} - ${prediction.forecast}`)
        if (prediction.forecast.toLowerCase() == 'rain') {
          rain = true
        }
      })
  
      // Let's check if it is going to rain and add proper message to response
      if (rain) {
        response.push(`It looks like you need an umbrella in ${text} 🌧`)
      } else {
        response.push(`You don\'t need an umbrella in ${text} 😎`)
      }
  
      // This event will be caught by "messenger-bot" Socket
      // Content of the text argument will be sent as a replay
      event.emit('messenger-bot.message-send', {text: response.join('\n'), sender} )
    } catch(err) {
      // This event will be caught by "messenger-bot" Socket
      // Content of the text argument (in this case error message) will be sent as a replay
      event.emit('messenger-bot.message-send', {text: `Something went wrong: ${err.data.message}. 
To check the weather, please type your city name in your message ie. Oslo`, sender} )
    }
  }
}