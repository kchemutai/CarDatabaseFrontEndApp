import { getCars, deleteCar } from "../api/carapi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	DataGrid,
	GridCellParams,
	GridColDef,
	GridToolbar,
} from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import AddCar from "./addcar";
import EditCar from "./EditCar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function Carlist() {
	const [open, setOpen] = useState(false); //for snack bar
	const { data, error, isSuccess } = useQuery({
		queryKey: ["cars"],
		queryFn: getCars,
	});
	const queryClient = useQueryClient();
	const { mutate } = useMutation(deleteCar, {
		onSuccess: () => {
			// Car deleted
			setOpen(true);
			queryClient.invalidateQueries({ queryKey: ["cars"] });
		},
		onError: (err) => {
			console.error(err);
		},
	});

	const columns: GridColDef[] = [
		{ field: "brand", headerName: "Brand", width: 200 },
		{ field: "model", headerName: "Model", width: 200 },
		{ field: "color", headerName: "Color", width: 200 },
		{ field: "registerNumber", headerName: "Reg.nr.", width: 150 },
		{ field: "modelYear", headerName: "Model Year", width: 150 },
		{ field: "price", headerName: "Price", width: 150 },
		{
			field: "edit",
			headerName: "",
			width: 90,
			sortable: false,
			filterable: false,
			disableColumnMenu: true,
			renderCell: (params: GridCellParams) => <EditCar cardata={params.row} />,
		},
		{
			field: "delete",
			headerName: "",
			width: 90,
			sortable: false,
			filterable: false,
			disableColumnMenu: true,
			renderCell: (params: GridCellParams) => (
				<IconButton
					aria-label="delete"
					size="small"
					onClick={() => {
						if (window.confirm("Are you sure you want to delete"))
							mutate(params.row._links.car.href);
					}}
				>
					<DeleteIcon fontSize="small" />
				</IconButton>
			),
		},
	];

	if (!isSuccess) {
		return <span>Loading car data ...</span>;
	} else if (error) {
		return <span>Error when fetching cars...</span>;
	} else {
		return (
			<>
				<AddCar />
				<DataGrid
					rows={data}
					columns={columns}
					getRowId={(row) => row._links.self.href}
					disableRowSelectionOnClick={true}
					slots={{ toolbar: GridToolbar }}
				/>
				<Snackbar
					open={open}
					autoHideDuration={2000}
					onClose={() => {
						setOpen(false);
					}}
					message="Car deleted successfully"
				></Snackbar>
			</>
		);
	}
}
export default Carlist;
