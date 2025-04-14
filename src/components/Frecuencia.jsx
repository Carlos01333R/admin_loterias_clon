import { useState, useEffect } from "react";
import {
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Image,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { supabase } from "../hook/supabaseClient";
import loteriaData from "../data/loterias.json";
import ModalBloquear from "./modalbloquear";

export default function LotteryAnalysis() {
  const [selectedLottery, setSelectedLottery] = useState(new Set([]));
  const [topNumbers, setTopNumbers] = useState([]);
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    setLotteries(loteriaData.loterias);
  }, []);

  useEffect(() => {
    if (selectedLottery.size > 0) {
      analyzeNumbers(Array.from(selectedLottery)[0]);
    }
  }, [selectedLottery]);

  async function analyzeNumbers(lottery) {
    setLoading(true);

    // Llamar a la función de Supabase
    const { data, error } = await supabase.rpc("get_combined_frequency", {
      lottery_name: lottery,
    });

    if (error) {
      console.error("Error fetching top numbers:", error);
      setLoading(false);
      return;
    }

    setTopNumbers(data);
    setLoading(false);
  }

  /**
   useEffect para abrir el modal de bloqueo
   cuando se carga la página
  useEffect(() => {
    onOpen();
  }, []);

   */

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader className="flex justify-center">
        <h2 className="text-2xl font-bold">Análisis de Lotería</h2>
      </CardHeader>
      <CardBody className="w-full flex justify-center items-center">
        <Select
          label="Selecciona una lotería"
          className="max-w-xs mb-4"
          selectedKeys={selectedLottery}
          onSelectionChange={setSelectedLottery}
        >
          {lotteries.map((lottery) => (
            <SelectItem
              key={lottery.name}
              value={lottery.name}
              textValue={lottery.name}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={lottery.logo || "/placeholder.svg"}
                  alt={`Logo de ${lottery.name}`}
                  className="w-6 h-6 rounded"
                />
                <span>{lottery.name}</span>
              </div>
            </SelectItem>
          ))}
        </Select>

        {loading ? (
          <div className="flex justify-center">
            <Spinner color="default" labelColor="white" label="Cargando..." />
          </div>
        ) : selectedLottery.size > 0 ? (
          <Table aria-label="Números más repetidos">
            <TableHeader>
              <TableColumn>NÚMERO</TableColumn>
              <TableColumn>FRECUENCIA</TableColumn>
              <TableColumn>PREMIADOS</TableColumn>
            </TableHeader>
            <TableBody>
              {topNumbers.map(
                ({ numero, frecuencia_ventas, frecuencia_win }) => (
                  <TableRow key={numero}>
                    <TableCell>{numero}</TableCell>
                    <TableCell>{frecuencia_ventas} veces</TableCell>
                    <TableCell>{frecuencia_win} premios</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500">
            Selecciona una lotería para ver los números más repetidos.
          </p>
        )}
      </CardBody>
      <ModalBloquear isOpen={isOpen} onOpenChange={onOpenChange} />
    </Card>
  );
}
