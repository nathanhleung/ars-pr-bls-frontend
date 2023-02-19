import { Box, Button, Container, HStack, Text } from '@chakra-ui/react';
import { Timer } from '@components/Timer';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import demo from '@data/sim.json';
import proof from '@data/dummy-proof.json';
import { abridgeKey } from '@config/demo';
import { useRouter } from 'next/router';

const NUM_SIGNERS = 7;
const THRESHOLD = 5;

const MAX_TIME = 15;

const Vault: NextPage = () => {
  const router = useRouter();
  const [time, setTime] = useState(0);

  const [ATSPRstate, setATSPRState] = useState();
  const [ATSState, setATSState] = useState();

  const demo_length = demo.length;

  const emitEvent = (entry: any) => {
    const ats = entry.ats;
    const atspr = entry.ats_pr;
    console.log('emit Event', entry.time, ats, atspr);
    setATSPRState(atspr);
    setATSState(ats);
  };

  const processEntry = (entry: any, index: number) => {
    emitEvent(entry);

    index++;
    if (index === demo_length) {
      return;
    }

    const nextEntry = demo[index];
    if (nextEntry == null) {
      return;
    }

    const timeDiff = nextEntry.time - entry.time;
    setTimeout(processEntry, timeDiff * 1000, nextEntry, index);
  };

  useEffect(() => {
    if (time === 0) {
      processEntry(demo[0], 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <>
      <Button
        variant='ghost'
        color='white'
        colorScheme='blackAlpha'
        onClick={() => router.push('/')}
      >
        Go back
      </Button>
      <Container textAlign='center' py={10} px={10} maxW='1200px'>
        <Text as='h1'>The Vault</Text>
        <Text>
          Accountable Threshold Signatures. We have {NUM_SIGNERS} signers in
          this group. With a threshold set to {THRESHOLD}.
        </Text>
        <Timer maxTime={MAX_TIME} time={time} setTime={setTime} />
        <HStack
          gap={4}
          pt={2}
          align='flex-start'
          alignItems='flex-start'
          verticalAlign='top'
        >
          <Box
            // @ts-ignore
            width={ATSState && ATSState.breached === 'true' ? '50%' : '100%'}
            minHeight='400px'
          >
            <Box
              background='gray.700'
              width='100%'
              borderRadius={4}
              p={4}
              justifyContent='space-between'
            >
              <Text as='h3' pb={4}>
                without proactive refresh
              </Text>
              {/* @ts-ignore */}
              {ATSState && ATSState.breached === 'true' && (
                <Box>
                  {/* @ts-ignore */}
                  {ATSState.pks.map((pk: string, idx: number) => (
                    <Box
                      key={idx}
                      mx={1}
                      my={1}
                      p={0.5}
                      borderRadius={4}
                      background={
                        // @ts-ignore
                        pk.secure === 'true' ? 'green.300' : 'red.400'
                      }
                    >
                      {/* @ts-ignore */}
                      <Text fontWeight='bold'>{abridgeKey(pk.key)}</Text>
                    </Box>
                  ))}
                  {/* @ts-ignore */}
                  {ATSState && ATSState.breached === 'true' && (
                    <Box>
                      <Text as='h2' color='red.100' pt={4}>
                        ⚡💥Breached💥⚡
                      </Text>
                      <Text>
                        Transaction sent to chain with the following zero
                        knowledge proof.
                      </Text>
                      <Box
                        background='gray.600'
                        p={2}
                        opacity={0.8}
                        my={2}
                        py={2}
                      >
                        <Text as='h4'>ZKProof</Text>
                        <Text>{JSON.stringify(proof)}</Text>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
              {/* @ts-ignore */}
              {ATSState && ATSState.breached === 'false' && (
                <Box>
                  {/* @ts-ignore */}
                  {ATSState.pks.map((pk: string, idx: number) => (
                    <Box
                      key={idx}
                      mx={1}
                      my={1}
                      p={0.5}
                      borderRadius={4}
                      background={
                        // @ts-ignore
                        pk.secure === 'true' ? 'green.300' : 'red.400'
                      }
                    >
                      {/* @ts-ignore */}
                      <Text fontWeight='bold'>{abridgeKey(pk.key)}</Text>
                    </Box>
                  ))}
                  <Text>
                    Collective private key: {/* @ts-ignore */}
                    {abridgeKey(ATSState?.collective_pk)}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
          <Box width='100%' minHeight='400px'>
            <Box
              background='gray.700'
              width='100%'
              borderRadius={4}
              p={4}
              justifyContent='space-between'
            >
              <Text as='h3' pb={4}>
                with proactive refresh
              </Text>
              {ATSPRstate &&
                // @ts-ignore
                ATSPRstate.pks.map((pk: string, idx: number) => (
                  <Box
                    key={idx}
                    mx={1}
                    my={1}
                    p={0.5}
                    borderRadius={4}
                    // @ts-ignore
                    background={pk.secure === 'true' ? 'green.300' : 'red.400'}
                  >
                    {/* @ts-ignore */}
                    <Text fontWeight='bold'>{abridgeKey(pk.key)}</Text>
                  </Box>
                ))}

              {ATSPRstate &&
              // @ts-ignore
              ATSState.breached === 'true' &&
              // @ts-ignore
              ATSPRstate.breached === 'false' ? (
                <Box>
                  <Text as='h2' color='green.100' pt={4}>
                    🛡️⚔️ Safe ⚔️🛡️
                  </Text>
                  <Text>
                    Adversary is unable to send a valid proof and signature.
                  </Text>
                  <Text>
                    <Text>
                      Collective private key: {/* @ts-ignore */}
                      {abridgeKey(ATSState?.collective_pk)}
                    </Text>
                  </Text>
                </Box>
              ) : (
                <Text>
                  Collective private key: {/* @ts-ignore */}
                  {abridgeKey(ATSPRstate?.collective_pk)}
                </Text>
              )}
            </Box>
          </Box>
        </HStack>
      </Container>
    </>
  );
};
export default Vault;
