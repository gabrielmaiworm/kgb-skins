/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Mic } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { BiUserVoice } from "react-icons/bi";
import { useTranslations } from "next-intl";

const LeitorDeAudio: React.FC = () => {
  const params = useParams<{ locale: string }>();
  const [isReading, setIsReading] = React.useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = React.useState<string>("");
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = React.useState<number>(1);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const speechLang = "pt";
  const utterance = new SpeechSynthesisUtterance();

  const t = useTranslations("Header.leitorAudio");

  const loadVoices = () => {
    const availableVoices = speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
      setIsLoading(false);
      // Defina o valor padrão da voz se necessário
      const defaultVoice = availableVoices.find((voice) => voice.lang === speechLang);
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.voiceURI);
      }
    }
  };

  React.useEffect(() => {
    // Inicializa as vozes quando o componente for montado
    loadVoices();

    // Adiciona o listener para quando as vozes forem carregadas
    speechSynthesis.onvoiceschanged = loadVoices;

    // Remove o listener quando o componente for desmontado
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const startReading = (text: string) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    utterance.text = text;
    const selectedVoiceObj = voices.find((voice) => voice.voiceURI === selectedVoice) || voices[0];
    utterance.voice = selectedVoiceObj;
    utterance.rate = rate;
    speechSynthesis.speak(utterance);
  };

  const handleTextClick = (e: MouseEvent) => {
    if (isReading) {
      const clickedElement = e.target as HTMLElement;
      const textContent = clickedElement?.innerText?.trim();
      if (textContent) {
        startReading(textContent);
      }
    }
  };

  const handleTriggerClick = () => {
    setIsReading(false);
    if (!isReading) {
    } else {
      setIsOpen((prev) => {
        if (prev) {
          pauseReading();
          setIsReading(false);
        }
        return !prev;
      });
    }
    pauseReading();
  };

  const toggleReadingMode = () => {
    setIsOpen(false);
    if (isReading) {
      pauseReading();
    } else {
      resumeReading();
    }
    setIsReading((prev) => !prev);
  };

  const pauseReading = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  };

  const resumeReading = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  };

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value); // Armazena o `voiceURI` da voz selecionada
  };

  const filteredVoices = voices.filter(
    (voice) => voice.lang.startsWith(speechLang) // Filtra as vozes pelo idioma
  );

  React.useEffect(() => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    if (!selectedVoice && availableVoices.length > 0) {
      const defaultVoice = availableVoices.find((voice) => voice.lang === speechLang);
      setSelectedVoice(defaultVoice ? defaultVoice.lang : availableVoices[0].lang);
    }
  }, [speechLang]);

  React.useEffect(() => {
    document.addEventListener("click", handleTextClick);

    return () => {
      document.removeEventListener("click", handleTextClick);
    };
  }, [isReading]);

  React.useEffect(() => {
    if (filteredVoices.length === 0) {
      // Definir pt-BR como o valor padrão quando não houver vozes para o idioma selecionado
      setSelectedVoice("pt-BR");
    }
  }, [filteredVoices]);

  return (
    <div className="my-auto h-full flex items-center">
      <Popover open={isOpen} onOpenChange={() => setIsOpen((state) => !state)}>
        <PopoverTrigger asChild>
          <button onClick={handleTriggerClick}>
            {isReading ? (
              <Mic
                width={32}
                height={32}
                className="text-white rounded-full w-full h-full cursor-pointer animate-pulse"
                style={{ animationDuration: "1.5s" }}
              />
            ) : (
              <BiUserVoice
                width={32}
                height={32}
                className="text-white cursor-pointer size-8"
                style={{ animationDuration: "1.5s" }}
              />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent className="p-4 w-60 flex flex-col gap-2">
          <div className=" flex space-x-2">
            <Button onClick={toggleReadingMode} className="w-full">
              {isReading ? t("isReading") : t("isNotReading")}
            </Button>
          </div>
          <Select onValueChange={handleVoiceChange} value={selectedVoice}>
            <SelectTrigger className="border border-border rounded p-2">
              <SelectValue placeholder="Selecione uma voz" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem disabled value="loading">
                  {t("carregando")}
                </SelectItem>
              ) : filteredVoices.length > 0 ? (
                filteredVoices.map((voice) => (
                  <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="no-voices">
                  {t("semVozes")}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {/* <div className="flex space-x-2">
            <Button onClick={() => changeRate(false)} className="w-1/2">
              Diminuir Velocidade
            </Button>
            <Button onClick={() => changeRate(true)} className="w-1/2">
              Aumentar Velocidade
            </Button>
          </div> */}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LeitorDeAudio;
