import factory from "../ethereum/factory.js";
import {Button, Card, CardContent, Typography} from "@mui/material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Layout from "../components/Layout.jsx";
import Link from "next/link";

const CampaignList = ({campaigns}) => {
    return (
        <Layout>
            <div>
                <h1>Welcome to campaign list page!!</h1>
                <Typography variant={"h4"}>Open Campaigns</Typography>

                <Link href={"/campaigns/new"}>
                    <Button sx={{ float: 'right', ml: 2 }} variant={"contained"} startIcon={<AddBusinessIcon/>}>Create Campaign</Button>
                </Link>
                {campaigns.map((address, index) => {
                    return (
                        <Card key={index}
                              sx={{
                                  mb: 2,
                                  width: '65%',
                                  float: 'left' }}>
                            <CardContent>
                                <Typography
                                    sx={{ overflowWrap: 'break-word' }}
                                    variant={"h6"} key={index}>{address}</Typography>
                                <Link href={`/campaigns/${address}`}>View Campaign</Link>
                            </CardContent>
                        </Card>
                    )
                })}

            </div>
        </Layout>
    )
}

CampaignList.getInitialProps = async () => {
    const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
    return {campaigns: deployedCampaigns};
}

export default CampaignList;