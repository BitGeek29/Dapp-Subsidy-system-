import React ,{Component} from 'react';
import '../componentsCSS/myHouses.css';

import Web3 from 'web3';
import Sch from '../abis/contracts/Sch.json';


class myHouse1 extends Component{
 
    constructor(props){
    super(props);
    
    
    this.state = {
       housesarray:'',
       housesarraylen:''
    };
 
    this.loadWeb3=this.loadWeb3.bind(this);
    this.displayHouses=this.displayHouses.bind(this);

    var isMobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if(isMobile){
    window.location.herf="/error"
  }


 }
async componentWillMount(){
        await this.loadWeb3()
     
      
}

    async loadWeb3(){

        if(!window.web3){
            window.alert('MetaMask not detected');
            window.location.href="/error";
        }

        if(window.ethereum){
          window.web3=new Web3(window.ethereum);//new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));   //new Web3(window.ethereum);
      
         
          await window.ethereum.enable();
        }
        else if(window.web3)
        {
          window.web3=new Web3(window.web3.currentProvider)
        }
        else{
            window.alert('MetaMask not detected');
        }

        var currentOwner= await window.web3.eth.getCoinbase();

        const networkId = await window.web3.eth.net.getId();
        const sch = new window.web3.eth.Contract(Sch.abi,Sch.networks[networkId].address);    //if ropsten use id as '3'  , if local ganache us ID as '5777'

        sch.methods.getHousesByOwner(currentOwner).call({from:currentOwner},(err,res)=>{
            if(err){
                console.log(err);
            }else{
         
                this.setState({
                    housesarray:res[0],
                    housesarraylen:res[1]
                })
            }

       
        })




 }
       
 displayHouses() {
    var inc=0;
    var housesarraylen=parseInt(this.state.housesarraylen);


    var houses=this.state.housesarray;
    console.log(houses);

     if(housesarraylen==0)
     {
         window.alert("you don't own any house");
         window.location.href="/home"
     }

     for(var v of houses){
        
        const table=document.getElementById('table2').getElementsByTagName('tbody')[0];
        console.log("1",v);
         var row=table.insertRow();
         row.className = "rowdiv";
         row.style.backgroundColor="#f3f3f3"
         row.style.color="black"
         for(var i=0;i<8;i++)
         {
            var col=row.insertCell(i);
            var newText  = document.createElement('span');
            if(i==5){
                var date=new Date(v[i]*1000)
                newText.innerHTML=date;
            }else if(i==6){
                
                if(v[i]==0){
                    newText.innerHTML="Unverified";
                }else{
                    newText.innerHTML="Verified";
                }
            }
            else{
                newText.innerHTML=v[i];
            }
            
            col.appendChild(newText);
         }
         var col=row.insertCell(8);
         var newText  = document.createElement('a');
         newText.href='/viewHistory/'+v[0]
         newText.innerHTML="View History";
         newText.style.color="blue";
         col.appendChild(newText);

       
       
    }
}
      



    render(){

            return(   


                <div id='bground'>   
                    
                    <div id="table-section">
                    <table class="table1" id="table2">
                        <tbody>
                            <tr>
                                <td>ID</td><td>House Name</td><td>Current Owner</td><td>Pin Code</td><td>Address</td><td>Creation Date</td><td>Status</td><td>History Count</td><td>More Info</td>
                            </tr>

                        </tbody>
                        {this.displayHouses()}


                    </table>

                       
                </div>
                      
    
                 </div>        
              
            );
    
    }
}


export default myHouse1;


