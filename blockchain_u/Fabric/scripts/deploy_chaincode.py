#Deploy the chaincode inside the chaincode dir to the channels, according to the config.json file.
#NOTE: currently works only for 1 channel config

import json
import pathlib
import subprocess
import sys

########## VARIABLES ##########
MICROFAB_CFG_PATH=str(pathlib.Path(__file__).parent.resolve())+'/../config/config.json'
PACKAGE_CC_SCRIPT=str(pathlib.Path(__file__).parent.resolve())+'/package_cc.sh'
INSTALL_APPROVE_CC_SCRIPT=str(pathlib.Path(__file__).parent.resolve())+'/install_and_approve_cc.sh'
COMMIT_CC_SCRIPT=str(pathlib.Path(__file__).parent.resolve())+'/commit_cc.sh'

########## METHODS ##########
def package_cc():
  try:
    subprocess.run([PACKAGE_CC_SCRIPT], check = True)
  except subprocess.CalledProcessError:
    sys.exit(1)

def install_and_approve_cc(org, channel):
  try:
    subprocess.run([INSTALL_APPROVE_CC_SCRIPT,org,channel], check = True)
  except subprocess.CalledProcessError:
    sys.exit(1)

def commit_cc(org, channel ):
  try:
    subprocess.run([COMMIT_CC_SCRIPT,org,channel], check = True)
  except subprocess.CalledProcessError:
    sys.exit(1)

########## MAIN ##########
#Package chaincode
package_cc()

#Get blockchain config
file = open(MICROFAB_CFG_PATH)
data = json.load(file)

#Deploy CC in each channels
for channel in data['channels']:
    channel_name=channel['name']
    # print("Channel: "+channel_name)

    #Get endorsing orgs for the channel
    org_names = []
    for org in channel['endorsing_organizations']:
      org_names.append(org)

    # Install and approve CC for each endorsing org
    for org_name in org_names:
      install_and_approve_cc(org_name, channel_name)

    # Commit CC (only 1 commit is required)
    commit_cc(org_names[0], channel_name)


file.close


