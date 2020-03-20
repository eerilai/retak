import React from "react";
import { Table, TableBody, TableHeader, TableRow, TableHeaderCell, TableCell } from "semantic-ui-react";

class BoardSizeTable extends React.PureComponent {
    public render() {
        return (
            <Table className="size-table">
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Board Size</TableHeaderCell>
                        <TableHeaderCell>Stones</TableHeaderCell>
                        <TableHeaderCell>Capstones</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>3 x 3</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>0</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>4 x 4</TableCell>
                        <TableCell>15</TableCell>
                        <TableCell>0</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>5 x 5</TableCell>
                        <TableCell>21</TableCell>
                        <TableCell>1</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>6 x 6</TableCell>
                        <TableCell>30</TableCell>
                        <TableCell>1</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>7 x 7</TableCell>
                        <TableCell>40</TableCell>
                        <TableCell>1 - 2</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>8 x 8</TableCell>
                        <TableCell>50</TableCell>
                        <TableCell>2</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
}

export default BoardSizeTable;