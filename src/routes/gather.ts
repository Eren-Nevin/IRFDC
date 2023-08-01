const baseAPI = 'https://irc.fda.gov.ir/api'

async function getCompaniesName(pageSize: number, pageNumber: number) {
    const endpoint = '/Company/LoadCompanies'
    const api = `${baseAPI}${endpoint}`
    const params = `pageNumber=${pageNumber}&pageSize=${pageSize}&term=`
    const url = `${api}?${params}`
    const res = await fetch(
        url, {

        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9,fa-IR;q=0.8,fa;q=0.7,af;q=0.6',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Cookie': 'ASP.NET_SessionId=fwrevdckktgrf2b0vkspmsvn',
            'DNT': '1',
            'Pragma': 'no-cache',
            'Referer': 'https://irc.fda.gov.ir/home/public/IRC',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"'
        }


    }


    )
}

