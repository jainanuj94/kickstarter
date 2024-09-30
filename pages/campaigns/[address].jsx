import {Button, Card, CardContent, Typography} from "@mui/material";
import Layout from "../../components/Layout.jsx";
import Campaign from "../../ethereum/campaign.js"
import {useEffect, useState} from "react";
import web3 from "../../ethereum/web3.js";
import ContributeForm from "../../components/ContributeForm.jsx";
import ViewListIcon from '@mui/icons-material/ViewList';
import Link from "next/link.js";

const CampaignDetails = (props) => {
    const [items, setItems] = useState([])

    useEffect(() => {
        const {
            balance,
            minimumContribution,
            numberOfRequests,
            approversCount,
            manager
        } = props;
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and he can approve requests',
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance of this campaign',
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution',
                description: 'Minimum contribution for a campaign',
            },
            {
                header: numberOfRequests,
                meta: 'Number of Requests',
                description: 'The number of requests that are waiting for approval',
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'The number of approvers that have contributed to this campaign',
            }
        ];
        setItems(items);
    }, []);


    return (
        <Layout>
            <div>
                <Typography variant={"h4"}>Campaign Details</Typography>
                <Typography variant={"subtitle1"}>Campaign Address: {props.contractAddress}</Typography>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                    <div style={{width: '70%', display: "flex", flexDirection: "column"}}>
                        <div>
                            {items.map((item, index) => {
                                return (
                                    <Card key={index} sx={{
                                        width: '45%',
                                        height: '200px',
                                        margin: 2,
                                        float: 'left',
                                        overflowWrap: 'break-word'
                                    }}>
                                        <CardContent>
                                            <Typography variant={"h6"} key={index}>{item.header}</Typography>
                                            <Typography variant={"subtitle1"}>{item.meta}</Typography>
                                        </CardContent>
                                        <CardContent style={{textAlign: "bottom"}}>
                                            <Typography variant={"body2"}>{item.description}</Typography>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                        <div style={{ margin: 16 }}>
                            <Link href={`/campaigns/${props.contractAddress}/requests`}>
                                <Button variant={"contained"} endIcon={<ViewListIcon/>}>View Requests</Button>
                            </Link>
                        </div>
                    </div>
                    <div style={{width: '30%'}}>
                        <ContributeForm contractAddress={props.contractAddress}/>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

CampaignDetails.getInitialProps = async (props) => {
    const campaign = await Campaign(props.query.address);

    const summary = await campaign.methods.getSummary().call();
    return {
        contractAddress: props.query.address,
        minimumContribution: Number(summary[0]),
        balance: Number(summary[1]),
        numberOfRequests: Number(summary[2]),
        approversCount: Number(summary[3]),
        manager: summary[4]
    };
}
export default CampaignDetails;