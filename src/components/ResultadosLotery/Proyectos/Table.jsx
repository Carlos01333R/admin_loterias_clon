import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
} from "@nextui-org/react";

import useResultadosLoteriaHoy from "../../../hook/useResultadosLotery";
import DropdownResultados from "./Dropdown";
import Form from "./Form";
import { SearchIcon } from "../../../icons/SearchIcon";
import IconActions from "../../../icons/IconActions";
import IconDescription from "../../../icons/IconDescription";
import IconVscode from "../../../icons/IconVscode";
import { useState } from "react";

export default function TableResultados() {
  const { resultadosHoy, loading, error } = useResultadosLoteriaHoy();
  console.log(resultadosHoy);
  const [Filter, setFilter] = useState(null);

  const columns = [
    { name: "LOTERIA", icon: IconDescription },
    { name: "RESULTADO", icon: IconVscode },
    { name: "FECHA", icon: IconActions },
    { name: "ACTIONS", icon: IconActions },
  ];

  const filterNameProyect = (resultadosHoy) => {
    if (!resultadosHoy) return []; // Asegúrate de que user no sea null
    if (Filter === null) return resultadosHoy;
    return resultadosHoy.filter((zona) =>
      zona.lottery.toLowerCase().includes(Filter.toLowerCase())
    );
  };

  const FilterProject = filterNameProyect(resultadosHoy); // Validación adicional para evitar errores

  return (
    <>
      <section className="w-full flex flex-col md:justify-center md:items-center mb-10">
        <div className="w-full flex justify-center items-center">
          {loading && <p>Loading...</p>}
        </div>

        <div className="w-full flex justify-center items-center">
          {error && <p>{error.message}</p>}
        </div>

        {!loading &&
          resultadosHoy && ( // Agrega una verificación para que `user` exista
            <>
              <article
                className="w-[90%] md:max-w-[1200px] mx-auto flex justify-end 
             mt-2 mb-2 items-center"
              >
                <Input
                  isClearable
                  className="w-full md:max-w-[30%]"
                  placeholder="Search by name..."
                  startContent={<SearchIcon />}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <Form />
              </article>

              <Table
                style={{
                  backgroundColor: "#13151a",
                }}
                isStriped
                className="text-white rounded-xl w-full md:max-w-[1200px] mx-auto p-0 m-0 "
                aria-label="Example static collection table"
              >
                <TableHeader>
                  {columns.map((col, index) => (
                    <TableColumn
                      style={{
                        backgroundColor: "#13151a",
                      }}
                      className="text-white shadow-2xl border-b-2 border-white rounded-xl"
                      key={index}
                    >
                      <p className="flex items-center gap-2 ">
                        {col.name} {col.icon && <col.icon />}
                      </p>
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {FilterProject.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.lottery}</TableCell>
                      <TableCell>{row.result}</TableCell>
                      <TableCell>{row.date}</TableCell>

                      <TableCell>
                        <DropdownResultados
                          id={row.id}
                          nombre={row.lottery}
                          resultado={row.result}
                          fecha={row.date}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
      </section>
    </>
  );
}
