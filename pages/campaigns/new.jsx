import Layout from "../../components/Layout.jsx";
import {Alert, Button, FormControl, Input, InputAdornment, InputLabel, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import factory from "../../ethereum/factory.js";
import web3 from "../../ethereum/web3.js";
import {useState} from "react";
import {useRouter} from "next/router.js";

const Campaign = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const onSubmit = async (data) => {
        setLoading(true);
        setErrorMessage('')
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(data.minimumContribution)
                .send({
                    from: accounts[0]
                });

            router.push('/');
        } catch (err) {
            setErrorMessage(err.message);
        }
        setLoading(false)
    }

    return (
        <Layout>
            <h3>Create Campaign</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl variant="standard" sx={{ m: 2 }}>
                    <InputLabel htmlFor="input-with-icon-adornment">
                        Minimum Contribution
                    </InputLabel>
                    <Input
                        type={"number"}
                        endAdornment={
                            <InputAdornment position="end">
                                <Typography variant={"body2"} type={"contained"}>Wei</Typography>
                            </InputAdornment>
                        }
                        {...register("minimumContribution",
                            { required: true })}
                    />
                </FormControl>
                <br/>
                {errorMessage && (<Alert severity="error">{errorMessage}</Alert>) }
                <br/>
                <Button disabled={loading} type="submit">
                    {loading ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </Layout>
    )
}

export default Campaign;