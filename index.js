import {
    ethers,
    Wallet,
    JsonRpcProvider,
    Contract,
    parseUnits
} from 'ethers';
import fs from 'fs';
import fetch from 'node-fetch';
import delay from 'delay';
import chalk from 'chalk';

const RPC_URL = 'https://bsc-dataseed2.ninicoin.io';
const bscProvider = new JsonRpcProvider(RPC_URL);

const randstr = (length) =>
new Promise((resolve, reject) => {
	var text = "";
	var possible =
	"1234567890";

	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	resolve(text);
});
const logindangettoken = (address,raw,sign) => new Promise((resolve, reject) => {
	try{
		const bodyData={
			"address": address,
			"raw": raw,
			"sign": sign
		}
      

		fetch("https://dappapi.vip3.io/api/v1/auth", {
			"headers": {
				'Accept': 'application/json',
				'Accept-Encoding': 'gzip, deflate, br',
				'Accept-Language': 'en-US,en;q=0.9',
				'Connection': 'keep-alive',
				'Content-Type': 'application/json;charset=UTF-8',
				'Origin': 'https://dapp.vip3.io',
				'Referer': 'https://dapp.vip3.io/',
				'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-site',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			},
			body: JSON.stringify(bodyData),
			"method": "POST"
		})
		.then(res => res.json())
		.then(res => {
			resolve(res);
		})
		.catch(err => {
			reject(err)
		})


	}catch(erorbos){
		console.log('UPS ADA EROR =>'+erorbos)
	}

});

const checkInPost = ( bearer, taskId) => new Promise((resolve, reject) => {
    fetch('https://dappapi.vip3.io/api/v1/task/submit', {
        method: 'POST',
        headers: {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'authorization': `${bearer}`,
            'content-type': 'application/json',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'Origin': 'https://dapp.vip3.io',
            'Referer': 'https://dapp.vip3.io/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: JSON.stringify({
            'taskId':taskId,
        })
    })
        .then(res => res.json())
        .then(body => {
            resolve(body)
        })
        .catch(err => {
            reject(err)
        });
});

(async () => {
    while (true) {
        let dataArrayPrivateKey = fs.readFileSync('./privateKey.txt', 'utf-8').split('\n');
        for (const PK of dataArrayPrivateKey){


                const privateKey = PK.replace('\r','');
                const wallet = new Wallet(privateKey, bscProvider);
                const walletAddress = wallet.address;
                console.log('Address :'+walletAddress)
                await delay(1000)

                const nonceData = `Welcome to VIP3!\n\nClick \"Sign\" to sign in and accept the VIP3 Terms of Use(https://vip3.gitbook.io/term-of-use/).\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n
                 \nWallet address:\n${walletAddress}\n\nNonce: ${await randstr(13)} `;
                 const signatureResult = await wallet.signMessage(nonceData);
                 const tokenresult = await logindangettoken(walletAddress,nonceData,signatureResult);
                 console.log(tokenresult)
                 const authcuy='Bearer '+ tokenresult.data.token
                 console.log(authcuy)

                await delay(1000)
                console.log('Success login...')
                console.log('Trying to checkin')
                const checkin = await checkInPost(authcuy,13);
                if (checkin.data) {
                    const datas = checkin.data.msg;

                    console.log(datas)
                    console.log('check result')
                    console.log(`Success checkin address : ${chalk.green(walletAddress)}`)
                   

                    
                }else{
                    console.log(`Sudah Daily Checkin ${chalk.red(walletAddress)}`)
                }


            console.log('next address')
            await delay(1000)
        }
        console.log('DONE ALL, wait for next 24 hour + 1 minute')
        await delay(86460000)
    }
})();
