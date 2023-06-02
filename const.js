const env = require('./env')

let resUrl
let mp3FilePath
let dbHost
let dbUser
let dbPwd
console.log(env);
if (env === 'dev') {
 
  resUrl = 'http://localhost:8088'
  mp3FilePath = '/Users/HP/Desktop/01.introduce/01-nginx/resouce/MP3'
  dbHost = 'localhost'
  dbUser = 'root'
  dbPwd = '123'
} else if (env === 'prod') {
  // resUrl = 'http://106.15.231.180'
  // mp3FilePath = '/root/nginx/upload/mp3'
  // dbHost = '106.15.231.180'
  // dbUser = 'root'
  // dbPwd = 'Abcd123456.'
  resUrl = 'http://localhost:8088'
  mp3FilePath = '/Users/HP/Desktop/01.introduce/01-nginx/resouce/MP3'
  dbHost = 'localhost'
  dbUser = 'root'
  dbPwd = '123'
}

const category = [
  'Biomedicine',
  'BusinessandManagement',
  'ComputerScience',
  'EarthSciences',
  'Economics',
  'Engineering',
  'Education',
  'Environment',
  'Geography',
  'History',
  'Laws',
  'LifeSciences',
  'Literature',
  'SocialSciences',
  'MaterialsScience',
  'Mathematics',
  'MedicineAndPublicHealth',
  'Philosophy',
  'Physics',
  'PoliticalScienceAndInternationalRelations',
  'Psychology',
  'Statistics'
]

module.exports = {
  resUrl,
  category,
  mp3FilePath,
  dbHost,
  dbUser,
  dbPwd
}
