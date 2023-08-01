const baseAPI = 'https://irc.fda.gov.ir/api'

async function getCompaniesName(pageSize: number, pageNumber: number) {
    const endpoint = '/Company/LoadCompanies'
    const api = `${baseAPI}${endpoint}`
    const params = `pageNumber=${pageNumber}&pageSize=${pageSize}&term=`
    const url = `${api}?${params}`
    const res = await fetch(
        url, {

            header

            
        }


    )
}

'Accept' : 'application/json, text/plain, */*'
'Accept-Language' : 'en-US,en;q=0.9,fa-IR;q=0.8,fa;q=0.7,af;q=0.6'
'Cache-Control' : 'no-cache'
'Connection' : 'keep-alive'
'Cookie' : 'ASP.NET_SessionId=fwrevdckktgrf2b0vkspmsvn'
'DNT' : '1'
'Pragma' : 'no-cache'
'Referer' : 'https://irc.fda.gov.ir/home/public/IRC'
'Sec-Fetch-Dest' : 'empty'
'Sec-Fetch-Mode' : 'cors'
'Sec-Fetch-Site' : 'same-origin'
