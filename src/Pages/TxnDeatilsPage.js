import React, { useState, useEffect } from "react";
import Data from "../Assets/DummyData.json";
import { Tree } from "antd";
import { DownOutlined, MinusOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
export default function TxnDetailsPage() {
  const [transaction, setTransaction] = useState({});
  const [childTreeState, setChildTreeState] = useState([]);

  useEffect(() => {
    setTransaction(Data[0]);
  }, [Data]);

  useEffect(() => {
    setChildTreeStructure(transaction.calls);
  }, [transaction]);

  const addressLinkFunc = (address, label, badge, chainId) => {
    if (address && address != "0x0000000000000000000000000000000000000000") {
      return (
        /*  only work for mainnet */
        <a
          style={{ textDecoration: "none" }}
          href={`https://${
            chainId != "mainnet" ? `${chainId}.` : ""
          }etherscan.io/address/${address}`}
          target="_blank"
        >
          {badge !== "None" && <span>[{badge}] </span>}
          <span>{label}</span>
        </a>
      );
    } else {
      return <a>{label}</a>;
    }
  };

  const nft_link = (address, label, chain_id) => {
    if (address && address != "0x0000000000000000000000000000000000000000") {
      return (
        <a
          href={`https://${
            chain_id != "mainnet" ? `${chain_id}.` : ""
          }etherscan.io/token/${address}`}
          target="_blank"
        >
          {label}
        </a>
      );
    } else {
      return <span>{label}</span>;
    }
  };

  const printEventArgument = (arg) => {
    let arr = [];
    arg.forEach(function (argument, index) {
      if (argument.type != "ignore") {
        if (index > 0) {
          arr.push(<span>,&nbsp;</span>);
        }
        if (argument.name == "[no ABI]") {
          arr.push(<span className="badge badge-danger">no_ABI</span>);
        } else {
          if (argument.name) {
            arr.push(
              <span style={{ color: "darkred" }}>{argument.name}=</span>
            );
          }
          if (argument.type == "tuple") {
            arr.push(printEventArgument(argument.value));
          } else if (argument.type == "tuple[]") {
            arr.push(
              <span>
                [
                {argument.value.map((sub_arg) => {
                  return printEventArgument(sub_arg);
                })}
                ]
              </span>
            );
          } else if (argument.type == "address") {
            arr.push(
              addressLinkFunc(
                argument.value.address,
                argument.value.name,
                argument.value.badge,
                "mainnet"
              )
            );
          } else if (argument.type == "nft") {
            arr.push(nft_link(argument.value.address, argument.value.name));
          } else if (argument.type == "call") {
            arr.push(
              <>
                <span>
                  {addressLinkFunc(
                    argument.value.address,
                    argument.value.name,
                    argument.value.badge,
                    "mainnet"
                  )}
                </span>
                {argument.value.function_name}
                {printEventArgument(argument.value.arguments)}
              </>
            );
          } else {
            arr.push(<span>{argument.value}</span>);
          }
        }
      }
    });
    return arr;
  };

  const printCallArguments = (argu) => {
    let arr = [];
    if (argu.length > 0) {
      console.log({ argu });
      argu.forEach(function (argument, index) {
        if (argument.type != "ignore") {
          if (index > 0) {
            arr.push(<span>,&nbsp;</span>);
          }
          if (argument.name == "[no ABI]") {
            arr.push(<span className="badge badge-danger">no_ABI</span>);
          } else {
            if (argument.name) {
              arr.push(
                <span style={{ color: "darkred" }}>{argument.name}=</span>
              );
            }
            if (argument.type == "tuple") {
              <>{printCallArguments(argument.value)};</>;
            } else if (argument.type == "tuple[]") {
              arr.push(
                <span>
                  [
                  {argument.value.map((value, index) => {
                    return index > 0 ? (
                      <span>,&nbsp;{printCallArguments(value)}</span>
                    ) : (
                      <span>{printCallArguments(value)}</span>
                    );
                  })}
                  ]
                </span>
              );
            } else if (argument.type == "address") {
              arr.push(
                <span>
                  {addressLinkFunc(
                    argument.value.address,
                    argument.value.name,
                    argument.value.badge,
                    "mainnet"
                  )}
                </span>
              );
            } else if (argument.type == "address[]") {
              arr.push(
                <>
                  [
                  {argument.value.map((value, index) => {
                    if (index > 0) {
                      return <span>,&nbsp;{value}</span>;
                    }

                    return <span>{value}</span>;
                  })}
                  ]
                </>
              );
            } else if (argument.type == "nft") {
              nft_link(argument.value.address, argument.value.name, "mainnet");
            } else if (argument.type == "call") {
              arr.push(
                <>
                  (
                  {addressLinkFunc(
                    argument.value.address,
                    argument.value.name,
                    argument.value.badge,
                    "mainnet"
                  )}
                  <span style={{ color: "darkgreen" }}>
                    {argument.value.function_name}
                  </span>
                  {printEventArgument(argument.value.arguments)})
                </>
              );
            } else {
              arr.push(<span>{argument.value}</span>);
            }
          }
        }
      });
    }

    return arr;
  };

  var childTree = [];
  var indentation = {};
  const printCallLine = (call) => {
    if (call) {
      console.log({ call });
      let paragraph = [];
      let main = [];
      paragraph.push(
        <span style={{ color: "slategray" }}>
          [{call.gas_used != "None" ? call.gas_used : "N/A"}]:{" "}
        </span>
      );
      if (call.error != "None") {
        paragraph.push(<span style={{ color: "red" }}>({call.error})</span>);
      }
      if (call.call_type == "delegatecall") {
        paragraph.push(<span style={{ color: "darkorange" }}>(delegate)</span>);
      }
      if (call.value && call.call_type != "selfdestruct") {
        paragraph.push(
          <span style={{ color: "blue" }}>ETH {call.value}-</span>
        );
      }
      if (call.call_type == "selfdestruct") {
        paragraph.push(
          <>
            <span>
              {addressLinkFunc(
                call.from_address.address,
                call.from_address.name,
                call.from_address.badge,
                "mainnet"
              )}
            </span>
            <span style={{ color: "darkgreen" }}>
              .{call.call_type}
              {call.value > 0 && (
                <>
                  <span style={{ color: "blue" }}>ETH {call.value}</span>
                  <span>
                    {addressLinkFunc(
                      call.to_address.address,
                      call.to_address.name,
                      call.to_address.badge,
                      "mainnet"
                    )}
                  </span>{" "}
                </>
              )}
            </span>
          </>
        );
      } else if (call.call_type == "create") {
        paragraph.push(
          <>
            {addressLinkFunc(
              call.to_address.address,
              call.to_address.name,
              call.to_address.badge,
              "mainnet"
            )}
            .<span style={{ color: "darkgreen" }}>New()</span>
          </>
        );
      } else {
        if (call.call_type == "delegatecall") {
          paragraph.push(
            addressLinkFunc(
              call.from_address.address,
              call.from_address.name,
              call.from_address.badge,
              "mainnet"
            )
          );
        } else {
          paragraph.push(
            <>
              {addressLinkFunc(
                call.to_address.address,
                call.to_address.name,
                call.to_address.badge,
                "mainnet"
              )}
            </>
          );
        }
        if (call.call_type == "delegatecall") {
          paragraph.push(
            <>
              [
              <span className="delegate">
                {addressLinkFunc(
                  call.to_address.address,
                  call.to_address.name,
                  call.to_address.badge,
                  "mainnet"
                )}
                -
              </span>
            </>
          );
        }
        if (call.function_guessed != "False") {
          paragraph.push(
            <span style={{ color: "dodgerblue" }}>.{call.function_name}</span>
          );
        } else if (call.function_name != "0x") {
          paragraph.push(
            <span style={{ color: "darkgreen" }}>.{call.function_name}</span>
          );
        } else {
          paragraph.push(<span style={{ color: "darkgreen" }}>.fallback</span>);
        }
        if (call.call_type == "delegatecall") {
          paragraph.push(<>]</>);
        }
        paragraph.push(
          <span>
            ({printCallArguments(call.arguments)}) {"=>"} (
            {printCallArguments(call.outputs)})
          </span>
        );
      }
      const unique_id = uuid();
      indentation = { ...indentation, [call.indent]: unique_id };
      childTree.push({
        title: paragraph,
        key: unique_id,
        icon: <MinusOutlined />,
        parentId: call.indent != 0 ? indentation[call.indent - 1] : null,
      });
      call.subcalls.forEach((sub_call) => {
        printCallLine(sub_call);
      });
    }
  };

  function EmittedEventsFunc() {
    const mappedTxns = transaction?.events?.map((eve) => {
      return (
        <tr>
          <td style={{ border: "1px solid #cccccc", padding: "5px 10px" }}>
            <span style={{ color: "slategray" }}>[{eve.index}]</span>{" "}
            <span>
              {addressLinkFunc(
                eve.contract.address,
                eve.contract.name,
                eve.contract.badge,
                eve.chain_id
              )}
            </span>
            {eve.event_guessed != "False" ? (
              <span style={{ color: "dodgerblue" }}>.{eve.event_name}</span>
            ) : (
              <span style={{ color: "darkgreen" }}>.{eve.event_name}</span>
            )}
            <span>({printEventArgument(eve.parameters)})</span>
          </td>
        </tr>
      );
    });
    return mappedTxns;
  }

  function AccountBalanceFunc() {
    const mappedBalance = transaction?.balances?.map((bal) => {
      return (
        <tr style={{ border: "1px solid #cccccc", padding: "5px 10px" }}>
          <td style={{ border: "1px solid #cccccc", padding: "5px 10px" }}>
            {addressLinkFunc(
              bal.holder.address,
              bal.holder.name,
              bal.holder.badge,
              "mainnet"
            )}
          </td>
          {bal.tokens.map((tok) => {
            return (
              <tr>
                {tok.token_standard == "ERC721" ? (
                  <td>
                    {addressLinkFunc(
                      tok.token_address,
                      tok.token_symbol,
                      "None",
                      "mainnet"
                    )}
                  </td>
                ) : (
                  <td
                    style={{
                      border: "1px solid #cccccc",
                      padding: "5px 10px",
                    }}
                  >
                    {addressLinkFunc(
                      tok.token_address,
                      tok.token_symbol,
                      "None",
                      "mainnet"
                    )}
                  </td>
                )}
                <td
                  style={{
                    border: "1px solid #cccccc",
                    padding: "5px 10px",
                  }}
                >
                  {parseFloat(tok.balance) < 0 ? (
                    <span style={{ color: "darkred" }}>{tok.balance}</span>
                  ) : (
                    <span>{tok.balance}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tr>
      );
    });
    return mappedBalance;
  }

  const setChildTreeStructure = (calls) => {
    printCallLine(calls);
    if (childTree.length > 0) {
      const idMapping = childTree.reduce((acc, el, i) => {
        acc[el.key] = i;
        return acc;
      }, {});
      let root,
        flag = false;
      childTree.forEach((el, index) => {
        if (el.parentId == null) {
          root = el;
          return;
        }
        const parentEl = childTree[idMapping[el.parentId]];
        parentEl.children = [...(parentEl?.children || []), el];
        if (index == childTree?.length - 1) {
          flag = true;
        }
      });
      console.log({ root });
      if (flag) {
        setChildTreeState([{ ...root }]);
      }
    }
  };
  return (
    <div>
      <p style={{ fontWeight: "bold", color: "green" }}>
        <span style={{ fontWeight: "bold", color: "black" }}>
          {" "}
          Analysis for{" "}
        </span>{" "}
        : {transaction?.metadata?.tx_hash} / {transaction?.metadata?.chain_id}
      </p>
      <div>
        <div>
          Block number:{" "}
          <span style={{ color: "darkred" }}>
            {transaction?.block_metadata?.block_number}
          </span>{" "}
          at{" "}
          <span style={{ color: "darkred" }}>
            {transaction?.metadata?.timestamp}
          </span>{" "}
          UTC
        </div>
        <div>
          Tx cost:{" "}
          <span style={{ color: "darkred" }}>
            {(transaction?.block_metadata?.gas_used *
              transaction?.metadata?.gas_price) /
              10 ** 9}
          </span>{" "}
          ETH{" "}
          <span style={{ color: "darkred" }}>
            {(transaction?.block_metadata?.gas_used *
              transaction?.metadata?.gas_price *
              29) /
              10 ** 9}
          </span>{" "}
          USD
        </div>
        <div>
          Gas used:{" "}
          <span style={{ color: "darkred" }}>
            {transaction?.block_metadata?.gas_used}
          </span>{" "}
          /{" "}
          <span style={{ color: "darkred" }}>
            {transaction?.metadata?.gas_price}
          </span>{" "}
          Gwei
        </div>
      </div>

      <div>
        <h3 style={{ margin: "20px 0px 10px 0px" }}>Emitted events:</h3>
        <table>{EmittedEventsFunc()}</table>
      </div>

      <div>
        <h3 style={{ margin: "20px 0px 10px 0px" }}>Account balances:</h3>
        <table style={{ border: "1px solid #cccccc", padding: "5px 10px" }}>
          <thead style={{ backgroundColor: "#DDDDDD" }}>
            <tr>
              <th
                style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                scope="col"
              >
                Address
              </th>
              <th
                style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                scope="col"
              >
                Token
              </th>
              <th
                style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                scope="col"
              >
                Balance
              </th>
            </tr>
          </thead>
          <tbody>{AccountBalanceFunc()}</tbody>
        </table>
      </div>

      <div>
        <h3 style={{ margin: "20px 0px 10px 0px" }}>Token transfers:</h3>
        <table style={{ border: "1px solid #cccccc", padding: "5px 10px" }}>
          <thead style={{ backgroundColor: "#DDDDDD" }}>
            <tr>
              <th
                style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                scope="col"
              >
                Sender
              </th>
              <th
                style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                scope="col"
              >
                Token
              </th>
              <th
                style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                scope="col"
              >
                Amount
              </th>
              <th
                style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                scope="col"
              >
                Reciever
              </th>
            </tr>
          </thead>
          <tbody>
            {transaction?.transfers?.map((transf) => {
              return (
                <tr
                  style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                >
                  <td
                    style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                  >
                    {addressLinkFunc(
                      transf.from_address.address,
                      transf.from_address.name,
                      transf.from_address.badge,
                      "mainnet"
                    )}
                  </td>
                  {transf.token_standard == "ERC721" ? (
                    <td>
                      {addressLinkFunc(
                        transf.token_address,
                        transf.token_symbol,
                        "None",
                        "sas"
                      )}
                    </td>
                  ) : (
                    <td>
                      {addressLinkFunc(
                        transf.token_address,
                        transf.token_symbol,
                        "None",
                        "sas"
                      )}
                    </td>
                  )}
                  <td
                    style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                  >
                    {transf.value}
                  </td>
                  <td
                    style={{ border: "1px solid #cccccc", padding: "5px 10px" }}
                  >
                    {addressLinkFunc(
                      transf.to_address.address,
                      transf.to_address.name,
                      transf.to_address.badge,
                      "mainnet"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {transaction.calls ? (
        <div className="calls">
          <h3 style={{ marginTop: "30px", marginBottom: "22px" }}>
            Execution trace:
          </h3>
          <div id="tree">
            <ul className="tree">
              {childTreeState.length > 0 && (
                <>
                  <Tree
                    treeData={[
                      {
                        icon: <MinusOutlined />,
                        key: uuid(),
                        title: (
                          <div>
                            <span style={{ color: "slategray" }}>
                              [{transaction.metadata.gas_used}]:{" "}
                            </span>
                            {addressLinkFunc(
                              transaction.metadata.sender?.address,
                              transaction.metadata.sender?.name,
                              "sender",
                              "mainnet"
                            )}
                          </div>
                        ),
                      },
                      { ...childTreeState[0] },
                    ]}
                  />
                </>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <h3>Trace decoding error...</h3>
      )}
    </div>
  );
}
