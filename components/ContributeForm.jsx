import {Alert, Button, FormControl, FormHelperText, Input, InputAdornment, InputLabel, Typography} from "@mui/material";
import web3 from "../ethereum/web3.js";
import Campaign from "../ethereum/campaign.js";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {useRouter} from "next/router.js";

const ContributeForm = ({contractAddress}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();

    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const onSubmit = async (data) => {
        setLoading(true)
        setErrorMessage('');
        const accounts = await web3.eth.getAccounts();
        const campaign = await Campaign(contractAddress);
        try {
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(data.contribution, 'ether')
            })
            router.reload()
        } catch (e) {
            setErrorMessage(e.message);
        }
        setLoading(false);
        reset();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl variant="standard" sx={{m: 2}}>
                <InputLabel htmlFor="input-with-icon-adornment">
                    Contribution Amount
                </InputLabel>
                <Input
                    disabled={loading}
                    inputProps={{
                        inputMode: 'decimal', // To ensure decimal keypad on mobile devices
                    }}
                    endAdornment={
                        <InputAdornment position="end">
                            <Typography variant={"body2"} type={"contained"}>ether</Typography>
                        </InputAdornment>
                    }
                    {...register("contribution",
                        {
                            required: true,
                            pattern: {
                                value: /^\d*\.?\d*$/,
                                message: "Only positive numbers are allowed",
                            },
                            validate: (value) => value === "" || parseFloat(value) >= 0 || "The number must be positive",
                        }
                    )
                    }
                />
            </FormControl>
            {errors.contribution && (
                <FormHelperText>{errors.contribution.message}</FormHelperText>
            )}
            <br/>
            {errorMessage && (<Alert severity="error">{errorMessage}</Alert>)}
            <br/>
            <Button disabled={loading} type="submit">
                {loading ? "Contributing..." : "Contribute"}
            </Button>
        </form>
    );
}

export default ContributeForm;